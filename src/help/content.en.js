// Help content (English). content.ja.js must have the same shape: same sections, same number of items.
// Public answers follow the official FAQ on https://www.elitejinzai.com/.
const help = {
  public: {
    title: 'Help & FAQ',
    lead: 'New here? Start with the quick guide for you, or search the questions below.',
    search: 'Search questions',
    noResults: 'No questions match your search. Try another word, or contact us.',
    stillStuck: 'Can’t find your answer?',
    contactCta: 'Contact us',
    starts: [
      {
        id: 'applicants',
        title: 'Looking for a job',
        steps: [
          'Create a free account and choose “A job seeker”.',
          'Open “Job openings” and apply in one click.',
          'Prepare your documents: resume, 1–2 valid IDs, NBI or police clearance, barangay clearance.',
          'Track your application step by step in “My applications”.',
          'Once hired, see your store assignment and clock in and out from the portal.',
        ],
        cta: 'Create a job seeker account',
      },
      {
        id: 'clients',
        title: 'Hiring staff for your stores',
        steps: [
          'Create an account and choose “A client company”.',
          'Open “Manpower requests” and tell us the store, role, number of staff and start date.',
          'Our recruiters source, screen and train candidates for you.',
          'Follow how many staff are deployed on each request.',
          'See your deployed staff, today’s attendance and supervisor visits.',
        ],
        cta: 'Create a client account',
      },
    ],
    sections: [
      {
        id: 'general',
        title: 'About Elite Jinzai',
        items: [
          ['What is Elite Jinzai Marketing Services Inc.?', 'A manpower agency based in the Philippines that provides staffing and outsourcing solutions to various industries, including retail, sales and operations. We have specialised in sales staff for appliance and electronics brands since 2010.'],
          ['Where are you located?', 'Our head office is at Unit 4F Cypress Garden Bldg., 112 V.A. Rufino St., Legaspi Village, Makati City 1223. Office hours are Monday to Friday, 9:00 AM – 5:00 PM.'],
          ['What industries do you serve?', 'We specialise in retail, sales, warehousing and administrative support, and we are open to clients from other industries as well.'],
          ['Are you licensed and accredited?', 'Yes. We are licensed by the Department of Labor and Employment (DOLE) under Department Order No. 174, a certified member of PALSCON and accredited by PMAP.'],
        ],
      },
      {
        id: 'applicants',
        title: 'For job seekers',
        items: [
          ['How can I apply?', 'Create a free job seeker account on this website and apply from “Job openings”. You can also walk in at our office or apply through our official Facebook page.'],
          ['What are the requirements?', 'An updated resume or biodata, 1–2 valid IDs, an NBI or police clearance and a barangay clearance. A diploma or TOR is needed only if the client requires it.'],
          ['Do I need experience?', 'No. We have roles for fresh graduates and experienced applicants. Training may be provided depending on the role.'],
          ['How long does hiring take?', 'Usually 1–3 days, depending on the position, your documents and the client’s confirmation.'],
          ['Do you charge any fees?', 'No. We never collect placement or processing fees from applicants. Our services are free for job seekers.'],
          ['Where will I be assigned?', 'It depends on client needs. Assignments may be within NCR or in other regions such as North and South Luzon.'],
          ['Are the jobs full-time?', 'Most positions are full-time. Part-time or seasonal roles may be available depending on client demand.'],
          ['Will I have government benefits?', 'Yes. All deployed employees are processed for SSS, PhilHealth and Pag-IBIG. You can see your enrolment status in the portal.'],
          ['How do I know the status of my application?', 'Log in and open “My applications”. Each application shows its current step (Applied, Screening, Interview, Hired) and which documents are already verified.'],
        ],
      },
      {
        id: 'clients',
        title: 'For client companies',
        items: [
          ['How can we partner with Elite Jinzai?', 'Create a client account on this website and send a manpower request, or call our office to schedule a consultation.'],
          ['What is the hiring process?', 'We start by understanding your staffing needs, then source, screen and deploy qualified candidates. You can follow each request in the portal.'],
          ['Can you handle bulk or seasonal hiring?', 'Yes. We are equipped for large-scale recruitment and seasonal workforce demands. Enter the number of staff you need in your request.'],
          ['What if an employee resigns or underperforms?', 'We provide replacement and performance monitoring. Our field supervisors visit stores regularly and log their visits.'],
          ['Are your employees legally compliant?', 'Yes. Deployed employees are processed with SSS, PhilHealth and Pag-IBIG and are monitored for compliance with labour standards.'],
          ['Do you provide payroll and timekeeping?', 'Yes. We manage payroll, deductions and government contributions. Employees clock in and out in the portal, and you can see who is on duty.'],
        ],
      },
      {
        id: 'website',
        title: 'Using this website',
        items: [
          ['Which account should I create?', 'Choose “A job seeker” if you want to apply for work (this also covers employees after hiring). Choose “A client company” if you want to request staff for your stores. Company staff use accounts given by the office.'],
          ['I forgot my password. What do I do?', 'Password reset by email is not available yet. Please call our office and we will help you get back into your account.'],
          ['How do I change the language or dark mode?', 'Use the two menus at the top of every page: one for English / 日本語, one for System / Light / Dark. Your choice is remembered on your device.'],
          ['Is my data safe?', 'This portal is an early version. Your account details are currently stored in your own browser on this device, so please don’t use a password you use anywhere else.'],
        ],
      },
    ],
  },

  portal: {
    title: 'Guide & FAQ',
    lead: 'How the portal works for you, what each status means, and answers to common questions.',
    yourGuide: 'Your step-by-step guide',
    otherGuides: 'Guides for other roles',
    glossaryTitle: 'What the statuses mean',
    faqTitle: 'Portal questions',
    publicLink: 'Public help & FAQ',
    guides: {
      admin: {
        title: 'Recruiters & company staff',
        steps: [
          ['Post job openings', 'Go to Job openings → New job posting. Choose the category, employment type, location and number of openings. Close a posting when it is filled.'],
          ['Turn client requests into jobs', 'In Manpower requests, review new requests and click “Create job posting”. The request moves to Sourcing automatically.'],
          ['Screen applicants', 'In Applications, move each applicant from Applied to Screening to Interview. Use the filters to see one stage or one job.'],
          ['Verify documents', 'Tick each document after checking the original: resume, IDs, NBI or police clearance, barangay clearance. Hired stays locked until these four are verified.'],
          ['Hire and deploy', 'Move the applicant to Hired, then click “Deploy to a store”. Pick the client request to fill it, or type the company and store.'],
          ['Process benefits', 'In Deployments, tick SSS, PhilHealth and Pag-IBIG as each enrolment is completed. The dashboard lists staff still being processed.'],
          ['Supervise in the field', 'Log each store visit with a short note. Clients can read these notes. Check “on duty today” and monthly hours for timekeeping.'],
        ],
      },
      applicant: {
        title: 'Job seekers & employees',
        steps: [
          ['Complete your profile', 'In My account, add your mobile number and city so recruiters can contact you.'],
          ['Find a job and apply', 'Open Job openings, filter by category and click “Apply now”. Applying is free.'],
          ['Prepare your documents', 'In My applications, see which documents are verified. Bring the rest to the office when a recruiter contacts you.'],
          ['Follow your application', 'The step tracker shows Applied → Screening → Interview → Hired, with a note on what happens next.'],
          ['Start work', 'Once deployed, My assignment & time clock shows your client company and store.'],
          ['Clock in and out every day', 'Press “Time in” when you start and “Time out” when you finish. Your hours and recent attendance appear below.'],
          ['Check your benefits', 'See whether your SSS, PhilHealth and Pag-IBIG are enrolled or still being processed.'],
        ],
      },
      client: {
        title: 'Client companies',
        steps: [
          ['Request staff', 'Open Manpower requests → Request staff. Enter the position, store, location, number of staff, start date and any notes about products or schedules.'],
          ['Follow the request', 'The status changes from New to Sourcing, Partly filled and Filled. The bar shows how many staff are deployed.'],
          ['Meet your staff', 'Our deployed staff lists everyone assigned to your stores, with their start date.'],
          ['Check attendance', 'See who is on duty today and each person’s hours this month.'],
          ['Read supervisor visits', 'Our field supervisors log every store visit. Read their notes on each staff card.'],
          ['Need more people?', 'Send another request any time, including for bulk or seasonal needs.'],
        ],
      },
    },
    glossary: [
      ['applied', 'The application was received and is waiting for a recruiter.'],
      ['screening', 'The recruiter is checking background and documents.'],
      ['interview', 'The applicant is scheduled for an interview.'],
      ['hired', 'All required documents are verified and the applicant is hired. Next step: deployment to a store.'],
      ['rejected', 'Not selected for this job. The applicant can apply for other openings.'],
      ['new', 'A client request that recruiters have not started yet.'],
      ['sourcing', 'Recruiters are looking for candidates for this request.'],
      ['partial', 'Some, but not all, of the requested staff are deployed.'],
      ['filled', 'All requested staff are deployed.'],
      ['cancelled', 'The request was cancelled.'],
    ],
    faq: {
      admin: [
        ['Why is “Move to Hired” greyed out?', 'One or more required documents are not verified yet. The message under the buttons tells you how many are missing. The diploma/TOR is optional.'],
        ['A hired applicant disappeared from my list.', 'Hired applicants stay under “In progress” until they are deployed. After deployment they are under the “Hired” filter.'],
        ['How do I fill a client request?', 'When deploying, choose the request in “Client request”. The request becomes Partly filled or Filled automatically.'],
        ['Can I edit a job after posting?', 'Yes. Click Edit on the job card. Closing a posting hides it from applicants but keeps its applications.'],
      ],
      applicant: [
        ['I applied. What happens next?', 'A recruiter will contact you for screening. Keep your mobile number up to date in My account.'],
        ['Why does a document say “please bring”?', 'It has not been verified yet. Bring the original to the office; the recruiter will tick it after checking.'],
        ['I forgot to clock out.', 'Tell your field supervisor or the office so they can correct your hours.'],
        ['Do I pay anything to apply?', 'No. Elite Jinzai never charges placement or processing fees.'],
      ],
      client: [
        ['How fast will my request be filled?', 'Hiring usually takes 1–3 days per person, depending on the role and documents. Follow the progress bar on each request.'],
        ['Can I change a request?', 'Please call the office or send a new request with the updated details; a recruiter will update the original.'],
        ['How do I know my staff are at work?', 'Our deployed staff shows who has clocked in today and their monthly hours.'],
        ['Who supervises the staff?', 'Our field supervisors visit stores regularly and log each visit, which you can read on the staff card.'],
      ],
    },
  },
};

export default help;
