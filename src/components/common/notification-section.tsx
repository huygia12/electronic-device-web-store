import React, { FC, HTMLAttributes, useEffect, useRef, useState } from "react";
import { RiNotification2Fill } from "react-icons/ri";
import { cn } from "@/lib/utils";

interface NotificationSection extends HTMLAttributes<HTMLDivElement> {}

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
    <div
      ref={notificationSectionRef}
      className={cn("relative", props.className)}
    >
      <RiNotification2Fill
        size={34}
        onClick={() => setVisible((prevValue) => !prevValue)}
        className="cursor-pointer relative"
      />
      {hasChildren ? (
        <span className="-left-1 -top-1 absolute bg-destructive rounded-full w-5 h-5 border-amber-300 border-4" />
      ) : undefined}

      <div
        onClick={() => setVisible(false)}
        className={cn(
          "absolute w-max bg-white shadow-2xl -right-2 top-12 rounded-xl",
          visible ? `block` : `hidden`
        )}
      >
        <div className="absolute -top-6 right-3 border-[12px] border-white border-t-transparent border-r-transparent border-l-transparent" />
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
