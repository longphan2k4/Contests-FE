// Define a generic IconType for React components representing icons
export type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface QuickQuestion {
  icon: IconType;
  text: string;
  question: string;
}