export interface Contact {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
}

export interface Company {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  responsibilities: string[];
  row?: number;
}

export interface Education {
  institution: string;
  degree: string;
  start_date: string;
  end_date: string;
}

export interface Technology {
  name: string;
  frequency: number | string;
  comments: string;
}

export interface Mission {
  title: string;
  context: string;
  company: string;
  start_date: string;
  end_date: string;
  technologies: Technology[];
  tasks: string[];
  row?: number;
}

export interface Event {
  name: string;
  date: string;
  description: string;
  type: string;
}

export interface Profile {
  name: string;
  role: string;
  contacts: Contact;
  companies: Company[];
  education: Education[];
  missions: Mission[];
  events: Event[];
}

export interface TimelineItem {
  id: string;
  type: 'mission' | 'company' | 'education' | 'event';
  title: string;
  subtitle: string;
  startDate: Date;
  endDate: Date | null;
  data: Mission | Company | Education | Event;
  color: string;
}
