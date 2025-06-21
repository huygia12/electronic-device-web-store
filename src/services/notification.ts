import { axiosInstance } from "@/config";

const notificationEndpoint = `notification`;

const notificationService = {
  apis: {
    signupForNotification: async (email: string) => {
      const response = await axiosInstance.post(notificationEndpoint, {
        email: email.trim(),
      });

      return response;
    },
  },
};

export default notificationService;
