export type roomType = {
  id: string;
  room_name: string;
  created_at: Date;
  user_id: string;
  updated_at: Date;
  capacity: number;
  isRelease: boolean;
  black_list: string[];
};
