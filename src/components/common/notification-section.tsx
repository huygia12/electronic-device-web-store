import React, { FC, HTMLAttributes, useEffect, useRef, useState } from "react";
import { RiNotification2Fill } from "react-icons/ri";
import { cn } from "@/lib/utils";

interface NotificationSection extends HTMLAttributes<HTMLDivElement> {
  triangleCSS?: string;
}

const NotificationSection: FC<NotificationSection> = ({ ...props }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const notificationSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener(
      "mousedown",
      handleClickOutsideOfNotificationSection
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutsideOfNotificationSection
      );
  }, []);

  const handleClickOutsideOfNotificationSection = (event: MouseEvent) => {
    if (
      notificationSectionRef.current &&
      !notificationSectionRef.current.contains(event.target as Node)
    ) {
      setVisible(false);
    }
  };

  const hasChildren = React.Children.toArray(props.children).some(
    (child) => child !== undefined && child !== null
  );

  return (
    <div ref={notificationSectionRef} className="relative">
      <span
        className="cursor-pointer relative"
        onClick={() => setVisible((prevValue) => !prevValue)}
      >
        <RiNotification2Fill id="header-guide-step-2" size={34} />
        {hasChildren ? (
          <span className="-left-1 -top-1 absolute bg-destructive rounded-full w-5 h-5 border-amber-300 border-4" />
        ) : undefined}
      </span>

      <div
        onClick={() => setVisible(false)}
        className={cn(
          "absolute w-max bg-white shadow-2xl top-12 rounded-xl",
          props.className,
          visible ? `block` : `hidden`
        )}
      >
        <div
          className={cn(
            "absolute -top-6 border-[12px] border-white border-t-transparent border-r-transparent border-l-transparent",
            props.triangleCSS
          )}
        />
        {hasChildren ? (
          props.children
        ) : (
          <div className="p-10">
            <img src="/notification-empty.jpg" className="w-60" />
            <div className="text-base text-muted-foreground mt-5 text-center">
              Không có thông báo nào!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSection;
