import type { FaqItem } from './types';

// Ported verbatim from assets/js/data.js §8 (12 records, 3 groups).
export const faq: FaqItem[] = [
  {
    group: 'Booking',
    q: 'What is the difference between an open trip and a private charter?',
    a: 'An open trip is a scheduled departure where you reserve a cabin and share the boat with other guests. A private charter is the whole boat, on your dates, with an itinerary we build with you. Open trips are priced per person; charters are priced per boat per night.',
  },
  {
    group: 'Booking',
    q: 'How much deposit do you take?',
    a: 'Twenty-five percent of the cabin total to confirm your place. The balance is due sixty days before departure. Nothing is charged to your card during this reservation — we send a payment link once a human has confirmed availability.',
  },
  {
    group: 'Booking',
    q: 'What happens after I reserve?',
    a: 'You get a booking reference immediately and an email within a few minutes. Someone from the office — usually Ratih — replies within one working day with the payment link and joining instructions. Once the deposit is paid you get a link to the joining form, where you tell us who is coming — names, nationalities, diving tickets and what everyone eats.',
  },
  {
    group: 'Booking',
    q: 'Can I hold a cabin without paying?',
    a: 'Yes, for seventy-two hours. Reserve as normal and tell us in the notes field; we will hold it and not send the payment link until you confirm.',
  },
  {
    group: 'On board',
    q: 'Do I need to be a certified diver?',
    a: 'Not on either open trip — both work for confident snorkellers, and are built for families where only some of the group dives. Diving is offered by private charter on Sea Familia 2 only.',
  },
  {
    group: 'On board',
    q: 'Is there wifi?',
    a: 'Starlink on both boats, and it mostly works. We do ask guests to leave calls until after dinner, because the aft deck is small and everyone can hear you.',
  },
  {
    group: 'On board',
    q: 'What about children?',
    a: 'Very welcome from four upwards, and both open trips are built with them in mind — a crew who run reef school in the mornings, and flexible meal times.',
  },
  {
    group: 'On board',
    q: 'Can you handle dietary requirements?',
    a: 'Yes, including vegan, coeliac, nut allergies and halal, and we would rather know eight weeks out than eight hours. Pak Rudi buys at the market the morning we sail, so tell us early and it simply gets bought.',
  },
  {
    group: 'Money & policy',
    q: 'Which currencies can I pay in?',
    a: 'USD, IDR, EUR, AUD and SGD. Prices on this site convert at a rate we refresh weekly; the invoice is issued in the currency you choose at checkout and that is the rate you pay.',
  },
  {
    group: 'Money & policy',
    q: 'What is your cancellation policy?',
    a: 'Full refund of the deposit up to ninety days out, fifty percent up to sixty days, and no refund inside sixty days — though we will move you to another departure in the same season at no charge, once, whatever the notice.',
  },
  {
    group: 'Money & policy',
    q: 'Do I need insurance?',
    a: 'Yes, and it must cover diving to the depth you intend to dive plus emergency evacuation. We are DAN-affiliated and will ask for your policy number with the joining form.',
  },
  {
    group: 'Money & policy',
    q: 'What if the weather changes the itinerary?',
    a: 'It will, and the captain decides. Every itinerary on this site is a plan rather than a promise; we publish the anchorages we intend to use and swap them freely for safety or for a better day. We do not refund for weather changes, but we have never had a guest tell us the swap was worse.',
  },
];
