import { useEffect, useLayoutEffect, useState } from "react";
import "intro.js/introjs.css";
import { Steps } from "intro.js-react";

const steps = [
  {
    element: "#header-guide-step-1",
    intro: "Click vào biểu tượng này để mở Menu",
  },
  {
    element: "#header-guide-step-2",
    intro: "Click vào biểu tượng này để xem thông báo",
  },
];

const AdminHeaderIntroGuide = () => {
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (enabled) {
      localStorage.setItem("adminRouteGuideShown", "true");
    }
  }, [enabled]);

  useLayoutEffect(() => {
    const guideShown = localStorage.getItem("adminRouteGuideShown");
    if (!guideShown) {
      setEnabled(true);
    }
  }, []);

  return (
    <Steps
      enabled={enabled}
      steps={steps}
      initialStep={0}
      onExit={() => setEnabled(false)}
      options={{
        showProgress: true,
        showBullets: false,
        disableInteraction: true,
        nextLabel: "Tiếp tục →",
        prevLabel: "← Quay lại",
        doneLabel: "Hoàn thành!",
      }}
    />
  );
};

export default AdminHeaderIntroGuide;
