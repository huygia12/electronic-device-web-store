import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        positive:
          "font-extrabold bg-green-600 text-white rounded-md px-2 text-xl hover_bg-green-100 hover_text-green-400 hover_ring-2 hover_ring-green-600 transition ease-out duration-100",
        neutral:
          "font-extrabold bg-blue-600 text-white rounded-md px-2 text-xl hover_bg-blue-100 hover_text-blue-400 hover_ring-2 hover_ring-blue-600 transition ease-out duration-100",
        negative:
          "font-extrabold bg-primary text-white rounded-md px-2 text-xl hover_bg-primary-softer hover_text-primary-foreground hover_ring-2 hover_ring-primary transition ease-out duration-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export { buttonVariants };
