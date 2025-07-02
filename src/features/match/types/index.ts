export interface Contestant {
  registration_number: number;
  fullname: string;
  status:
    | "not_started"
    | "in_progress"
    | "confirmed1"
    | "confirmed2"
    | "eliminated"
    | "rescued"
    | "banned"
    | "completed";
  eliminated_at_question_order: number | null;  
  rescued_at_question_order?: number | null;
}

export interface Icon {
  id: number;
  registrationNumber: number;
  name: string;
  isDisintegrated: boolean;
  isRescued: boolean;
  particles: Particle[];
  isFading: boolean;
  isActive: boolean;
}

export interface Particle {
  id: string;
  size: number;
  left: string;
  top: string;
  tx: string;
  ty: string;
  rotate: string;
}
