import { Toaster as Sonner, toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-hairline group-[.toaster]:rounded-none group-[.toaster]:shadow-card group-[.toaster]:font-sans",
          title: "group-[.toast]:text-[13px] group-[.toast]:tracking-[0.02em]",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-[13px]",
          actionButton:
            "group-[.toast]:bg-foreground group-[.toast]:text-background group-[.toast]:rounded-none group-[.toast]:text-[10px] group-[.toast]:uppercase group-[.toast]:tracking-[0.24em]",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-none",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
