export interface Profile {
    _id: string;
    profileInfo: {
      firstName: string;
      lastName: string;
      birthDate: string;
      email: string;
      passwordHash: string;
    };
    cycleStatus: {
      isRegistrationComplete: boolean;
      inOnboardingCompleted: boolean;
    };
  }
  
  export interface MenstruationDay {
    date: string;
    type: 'BLEEDING' | 'FERTILITY' | 'OVULATION';
    note: string;
  }
  
  export interface MenstruationDays {
    menstrationDays: MenstruationDay[];
    cycleInfo: {
      cycleStartDate: string;
      cycleEndDate: string;
    };
  }
  
  export interface Insight {
    _id: string;
    title: string;
    content: string;
  }
  
  export interface Insights {
    insights: Insight[];
  }