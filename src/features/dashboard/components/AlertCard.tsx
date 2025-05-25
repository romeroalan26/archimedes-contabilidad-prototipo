import { AlertData } from "../types";

interface AlertCardProps {
  data: AlertData;
}

export default function AlertCard({ data }: AlertCardProps) {
  const getAlertConfig = (type: AlertData["type"]) => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-700",
          textColor: "text-green-800 dark:text-green-300",
          iconBgColor: "bg-green-100 dark:bg-green-900/30",
          iconColor: "text-green-600 dark:text-green-400",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
        };
      case "warning":
        return {
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-700",
          textColor: "text-yellow-800 dark:text-yellow-300",
          iconBgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          iconColor: "text-yellow-600 dark:text-yellow-400",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case "error":
        return {
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-700",
          textColor: "text-red-800 dark:text-red-300",
          iconBgColor: "bg-red-100 dark:bg-red-900/30",
          iconColor: "text-red-600 dark:text-red-400",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      default:
        return {
          bgColor: "bg-gray-50 dark:bg-gray-800",
          borderColor: "border-gray-200 dark:border-gray-700",
          textColor: "text-gray-800 dark:text-gray-300",
          iconBgColor: "bg-gray-100 dark:bg-gray-700",
          iconColor: "text-gray-600 dark:text-gray-400",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
    }
  };

  const config = getAlertConfig(data.type);
  const timeAgo = getTimeAgo(data.timestamp);

  function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Hace menos de 1 minuto";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Hace ${minutes} minuto${minutes !== 1 ? "s" : ""}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Hace ${hours} hora${hours !== 1 ? "s" : ""}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Hace ${days} día${days !== 1 ? "s" : ""}`;
    }
  }

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 transition-all duration-200 hover:shadow-sm`}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`flex-shrink-0 w-8 h-8 ${config.iconBgColor} ${config.iconColor} rounded-full flex items-center justify-center`}
        >
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${config.textColor} leading-5`}>
            {data.message}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {timeAgo}
            </p>
            <button className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
