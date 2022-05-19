import { Store } from "react-notifications-component"

export const showNotification = (statusSuccess = true, title, message) => {
    Store.addNotification({
      title: title,
      message: message,
      type: statusSuccess ? "success":"danger",
      container: "top-right",
      insert: "top",
      animationIn: ['animate__animated animate__fadeIn'],
      animationOut: ['animate__animated animate__fadeOut'],
      dismiss: {
        duration: 3000,
        onScreen: true,
        showIcon: true,
      }
    })
  }