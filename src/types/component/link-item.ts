interface LinkItem {
  name: string;
  visible: boolean;
  src?: string;
  handleClick?: () => void;
}

export type { LinkItem };
