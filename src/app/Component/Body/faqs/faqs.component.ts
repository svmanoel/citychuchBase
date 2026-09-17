import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.css'
})
export class FaqsComponent {

  // Text entered in the FAQ search box
  faqSearch = '';

  // Frequently asked questions
  faqs = [
    {
      id: 1,
      question: 'What should I expect when I visit City Church?',
      answer: `You can expect a warm welcome, contemporary worship,
      teaching from the Bible and an opportunity to connect with
      other people. You don't need to know anything about church
      before you come.`
    },
    {
      id: 2,
      question: 'Do I need to be a Christian to attend?',
      answer: `Not at all. Whether you're exploring Christianity,
      returning to church or have followed Jesus for many years,
      you are welcome to join us.`
    },
    {
      id: 3,
      question: 'What should I wear?',
      answer: `Come as you are. There is no particular dress code,
      so wear whatever you feel comfortable in.`
    },
    {
      id: 4,
      question: 'Are children welcome?',
      answer: `Yes. We want church to be a place where the whole
      family can feel welcome and included.`
    },
    {
      id: 5,
      question: 'What happens during a church service?',
      answer: `Our services include worship, prayer, teaching
      and time to connect with others. The service is designed
      to give people an opportunity to encounter God and explore
      faith together.`
    },
    {
      id: 6,
      question: 'How can I get involved?',
      answer: `There are many ways to get involved, from joining
      a small group or serving on a team to simply coming along
      and getting to know people. We'd love to help you find a
      place where you feel connected.`
    }
  ];


  // Filter FAQs according to the search text
  get filteredFaqs() {

    const search = this.faqSearch
      .trim()
      .toLowerCase();

    // Show all questions when there is no search
    if (!search) {
      return this.faqs;
    }

    return this.faqs.filter(faq => {

      const question = faq.question.toLowerCase();
      const answer = faq.answer.toLowerCase();

      // Search inside both question and answer
      return (
        question.includes(search) ||
        answer.includes(search)
      );

    });
  }


  // Clear the current search
  clearFaqSearch(): void {
    this.faqSearch = '';
  }

}