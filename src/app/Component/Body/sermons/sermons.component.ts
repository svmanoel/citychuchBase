
import {  Component,  OnInit,  OnDestroy,  ViewChild,  ElementRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafeUrlPipe } from '../safe-url.pipe';

// =====================================================
// SERMON EPISODE MODEL
// =====================================================

interface SermonEpisode {
  id: string;
  title: string;
  description: string;
  releaseDate: Date | null;
  audioUrl: string;
  spotifyUrl: string;
  imageUrl: string;
}

// =====================================================
// SERMONS COMPONENT
// =====================================================

@Component({
  selector: 'app-sermons',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SafeUrlPipe
  ],
  templateUrl: './sermons.component.html',
  styleUrls: ['./sermons.component.css']
})
export class SermonsComponent implements OnInit, OnDestroy {

  // =====================================================
  // API CONFIGURATION
  // =====================================================

  private readonly apiUrl =
    'http://apichurch.runasp.net/api/spotify/podcast/episodes';

  private readonly pageSize = 20;

  // =====================================================
  // EPISODE DATA
  // =====================================================

  episodes: SermonEpisode[] = [];

  filteredEpisodes: SermonEpisode[] = [];

  // The playing episode is independent of the active filters.
  playingEpisode: SermonEpisode | null = null;

  // Reference to the native HTML audio player.
  @ViewChild('audioPlayer')
  audioPlayer?: ElementRef<HTMLAudioElement>;

  // =====================================================
  // LOADING STATE
  // =====================================================

  isLoadingFirstPage = true;

  isLoadingRemaining = false;

  isCatalogComplete = false;

  errorMessage = '';

  // =====================================================
  // DATE FILTERS
  // =====================================================

  selectedMonth = '';

  selectedYear = '';

  availableMonths: {
    value: string;
    label: string;
  }[] = [];

  availableYears: string[] = [];

  // =====================================================
  // LIFECYCLE
  // =====================================================

  constructor(private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    await this.loadEpisodes();
  }

  ngOnDestroy(): void {
    // Stop playback when leaving the component.
    const audio = this.audioPlayer?.nativeElement;

    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }
  }

  // =====================================================
  // CURRENT EPISODE
  // =====================================================

  get currentEpisode(): SermonEpisode | null {
    return this.playingEpisode;
  }

  // Position in the complete library, not the filtered list.
  get currentPosition(): number {
    if (!this.playingEpisode) {
      return 0;
    }

    const index = this.episodes.findIndex(
      episode => episode.id === this.playingEpisode?.id
    );

    return index >= 0 ? index + 1 : 0;
  }

  // =====================================================
  // LOAD EPISODES
  // =====================================================

  async loadEpisodes(): Promise<void> {
    this.isLoadingFirstPage = true;
    this.errorMessage = '';

    try {
      const firstPage = await this.fetchPage(0);

      this.episodes = firstPage.items;

      this.filteredEpisodes = [...this.episodes];

      // Select the first episode without autoplay.
      if (!this.playingEpisode && this.episodes.length > 0) {
        this.playingEpisode = this.episodes[0];
      }

      this.isLoadingFirstPage = false;

      this.updateDateFilters();

      // Load the remaining episodes in the background.
      void this.loadRemainingPages(firstPage);

    } catch (error) {
      console.error(
        'Error loading podcast episodes:',
        error
      );

      this.errorMessage =
        'Unable to load the podcast episodes. Please try again.';

      this.isLoadingFirstPage = false;
    }
  }

  // =====================================================
  // FETCH API PAGE
  // =====================================================

  private async fetchPage(offset: number): Promise<{
    items: SermonEpisode[];
    total: number | null;
  }> {
    const url =
      `${this.apiUrl}?limit=${this.pageSize}&offset=${offset}`;

    const response: any = await firstValueFrom(
      this.http.get<any>(url)
    );

    const rawItems = this.extractItems(response);

    return {
      items: rawItems.map(
        (item: any, index: number) =>
          this.normalizeEpisode(item, offset + index)
      ),
      total: this.extractTotal(response)
    };
  }

  // =====================================================
  // EXTRACT EPISODES FROM API RESPONSE
  // =====================================================

  private extractItems(response: any): any[] {
    if (Array.isArray(response)) {
      return response;
    }

    const possibleArrays = [
      response?.items,
      response?.episodes,
      response?.data,
      response?.results,
      response?.episodes?.items,
      response?.data?.items,
      response?.data?.episodes
    ];

    return possibleArrays.find(
      value => Array.isArray(value)
    ) ?? [];
  }

  // =====================================================
  // EXTRACT TOTAL COUNT
  // =====================================================

  private extractTotal(response: any): number | null {
    const candidates = [
      response?.total,
      response?.totalCount,
      response?.totalItems,
      response?.pagination?.total,
      response?.data?.total,
      response?.data?.totalCount
    ];

    const value = candidates.find(
      item => typeof item === 'number'
    );

    return value !== undefined ? value : null;
  }

  // =====================================================
  // NORMALIZE EPISODE DATA
  // =====================================================

  private normalizeEpisode(
    item: any,
    fallbackIndex: number
  ): SermonEpisode {

    const title =
      item?.title ??
      item?.name ??
      item?.episodeName ??
      `Episode ${fallbackIndex + 1}`;

    const rawDate =
      item?.releaseDate ??
      item?.publishedAt ??
      item?.release_date ??
      item?.publicationDate ??
      item?.publishDate ??
      item?.date ??
      null;

    const parsedDate = rawDate
      ? new Date(rawDate)
      : null;

    const validDate =
      parsedDate &&
      !Number.isNaN(parsedDate.getTime())
        ? parsedDate
        : null;

    const spotifyUrl =
      item?.spotifyUrl ??
      item?.externalUrl ??
      item?.url ??
      item?.external_urls?.spotify ??
      item?.links?.spotify ??
      '';

    const audioUrl =
      item?.audioUrl ??
      item?.audio_url ??
      item?.audio ??
      item?.enclosureUrl ??
      item?.previewUrl ??
      item?.preview_url ??
      '';

    const imageUrl =
      item?.imageUrl ??
      item?.image ??
      item?.thumbnail ??
      item?.images?.[0]?.url ??
      '';

    return {
      id: String(
        item?.id ??
        item?.uri ??
        fallbackIndex
      ),

      title,

      description: item?.description ?? '',

      releaseDate: validDate,

      audioUrl:
        typeof audioUrl === 'string'
          ? audioUrl
          : '',

      spotifyUrl:
        typeof spotifyUrl === 'string'
          ? spotifyUrl
          : '',

      imageUrl:
        typeof imageUrl === 'string'
          ? imageUrl
          : ''
    };
  }

  // =====================================================
  // LOAD REMAINING PAGES
  // =====================================================

  private async loadRemainingPages(
    firstPage: {
      items: SermonEpisode[];
      total: number | null;
    }
  ): Promise<void> {

    this.isLoadingRemaining = true;

    let offset = firstPage.items.length;

    let expectedTotal = firstPage.total;

    let failed = false;

    try {
      while (
        expectedTotal === null ||
        offset < expectedTotal
      ) {
        const page = await this.fetchPage(offset);

        if (page.total !== null) {
          expectedTotal = page.total;
        }

        if (page.items.length === 0) {
          break;
        }

        const previousCount = this.episodes.length;

        this.appendUniqueEpisodes(page.items);

        // Prevent an infinite loop if the API repeats episodes.
        if (this.episodes.length === previousCount) {
          break;
        }

        offset += page.items.length;

        this.updateDateFilters();

        if (page.items.length < this.pageSize) {
          break;
        }
      }

    } catch (error) {
      console.error(
        'Error loading remaining episodes:',
        error
      );

      failed = true;

    } finally {
      this.isLoadingRemaining = false;
      this.isCatalogComplete = !failed;

      this.updateDateFilters();
    }
  }

  // =====================================================
  // APPEND UNIQUE EPISODES
  // =====================================================

  private appendUniqueEpisodes(
    items: SermonEpisode[]
  ): void {

    const existingIds = new Set(
      this.episodes.map(episode => episode.id)
    );

    for (const episode of items) {
      if (!existingIds.has(episode.id)) {
        this.episodes.push(episode);
        existingIds.add(episode.id);
      }
    }

    this.applyDateFilter();
  }

  // =====================================================
  // BUILD DATE FILTER OPTIONS
  // =====================================================

  private updateDateFilters(): void {
    const datedEpisodes = this.episodes.filter(
      episode => episode.releaseDate !== null
    );

    const monthMap = new Map<string, string>();

    const yearSet = new Set<string>();

    for (const episode of datedEpisodes) {
      const date = episode.releaseDate!;

      const monthValue =
        `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}`;

      const monthLabel = date.toLocaleDateString(
        'en-GB',
        {
          month: 'long',
          year: 'numeric'
        }
      );

      monthMap.set(monthValue, monthLabel);

      yearSet.add(String(date.getFullYear()));
    }

    this.availableMonths = Array
      .from(monthMap.entries())
      .map(([value, label]) => ({
        value,
        label
      }))
      .sort((a, b) =>
        b.value.localeCompare(a.value)
      );

    this.availableYears = Array
      .from(yearSet)
      .sort((a, b) =>
        b.localeCompare(a)
      );

    this.applyDateFilter();
  }

  // =====================================================
  // FILTER HANDLERS
  // =====================================================

  onDateFilterChange(): void {
    this.applyDateFilter();
  }

  private applyDateFilter(): void {
    this.filteredEpisodes = this.episodes.filter(
      episode => {

        if (!episode.releaseDate) {
          return !this.selectedMonth &&
                 !this.selectedYear;
        }

        const date = episode.releaseDate;

        const matchesMonth =
          !this.selectedMonth ||
          `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, '0')}` === this.selectedMonth;

        const matchesYear =
          !this.selectedYear ||
          String(date.getFullYear()) === this.selectedYear;

        return matchesMonth && matchesYear;
      }
    );

    // Do not change or stop the currently playing episode.
  }

  // =====================================================
  // SELECT EPISODE
  // =====================================================

  selectEpisode(index: number): void {
    if (
      index < 0 ||
      index >= this.filteredEpisodes.length
    ) {
      return;
    }

    const selectedEpisode = this.filteredEpisodes[index];

    // Keep the current playback position if already selected.
    if (this.playingEpisode?.id === selectedEpisode.id) {
      return;
    }

    // Stop the previous episode before switching.
    const audio = this.audioPlayer?.nativeElement;

    if (audio) {
      audio.pause();
    }

    this.playingEpisode = selectedEpisode;
  }

  // =====================================================
  // EPISODE NAVIGATION
  // =====================================================

  private getNavigationEpisodes(): SermonEpisode[] {
    // Use the filtered list if the current episode is visible.
    if (
      this.playingEpisode &&
      this.filteredEpisodes.some(
        episode => episode.id === this.playingEpisode?.id
      )
    ) {
      return this.filteredEpisodes;
    }

    // Otherwise, navigate through the complete library.
    return this.episodes;
  }

  private selectEpisodeObject(
    episode: SermonEpisode
  ): void {

    if (this.playingEpisode?.id === episode.id) {
      return;
    }

    const audio = this.audioPlayer?.nativeElement;

    if (audio) {
      audio.pause();
    }

    this.playingEpisode = episode;
  }

  previousEpisode(): void {
    if (!this.playingEpisode) {
      return;
    }

    const list = this.getNavigationEpisodes();

    const index = list.findIndex(
      episode => episode.id === this.playingEpisode?.id
    );

    if (index > 0) {
      this.selectEpisodeObject(list[index - 1]);
    }
  }

  nextEpisode(): void {
    if (!this.playingEpisode) {
      return;
    }

    const list = this.getNavigationEpisodes();

    const index = list.findIndex(
      episode => episode.id === this.playingEpisode?.id
    );

    if (index >= 0 && index < list.length - 1) {
      this.selectEpisodeObject(list[index + 1]);
    }
  }

  // =====================================================
  // AUDIO CONTROLS
  // =====================================================

  seekAudio(seconds: number): void {
    const audio = this.audioPlayer?.nativeElement;

    if (
      !audio ||
      !Number.isFinite(audio.duration)
    ) {
      return;
    }

    audio.currentTime = Math.max(
      0,
      Math.min(
        audio.duration,
        audio.currentTime + seconds
      )
    );
  }

  restartEpisode(): void {
    const audio = this.audioPlayer?.nativeElement;

    if (!audio) {
      return;
    }

    audio.currentTime = 0;

    void audio.play().catch(error => {
      console.error(
        'Audio playback failed:',
        error
      );
    });
  }

  // =====================================================
  // DATE FORMATTING
  // =====================================================

  formatDate(date: Date | null): string {
    if (!date) {
      return 'Date unavailable';
    }

    return date.toLocaleDateString(
      'en-GB',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    );
  }

  // =====================================================
  // SPOTIFY EMBED URL
  // =====================================================

  getSpotifyEmbedUrl(url: string): string {
    if (!url) {
      return '';
    }

    try {
      const parsed = new URL(url);

      if (
        parsed.hostname !== 'open.spotify.com' &&
        parsed.hostname !== 'www.open.spotify.com'
      ) {
        return '';
      }

      const match = parsed.pathname.match(
        /^\/(episode|show)\/([a-zA-Z0-9]+)/
      );

      if (!match) {
        return '';
      }

      return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;

    } catch {
      return '';
    }
  }

  // =====================================================
  // RETRY LOADING
  // =====================================================

  retryLoading(): void {
    this.episodes = [];
    this.filteredEpisodes = [];
    this.playingEpisode = null;

    this.isCatalogComplete = false;

    void this.loadEpisodes();
  }
  
}
