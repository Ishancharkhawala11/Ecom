const { Server } = require("socket.io");
const Notification = require("../../models/Notification");

const initializeSocket = (server) => {
    const io = new Server(server, {
      cors: {
        origin:  [
          "https://ecom-beta-taupe.vercel.app",
          "https://ecom-ishans-projects-75140e8b.vercel.app",
          "https://ecom-git-main-ishans-projects-75140e8b.vercel.app",
          "http://localhost:5173",
          
        ],
        methods: ["GET", "POST"],
      },
    });
  
    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);
  
      socket.on("sendNotification", async (data) => {
        try {
          const newNotification = new Notification({
            message: data.message,
            user: data.user,
            orderId: data.orderId,
          });
  
          await newNotification.save();
          console.log("Notification saved to DB");
  
          io.emit("receiveNotification", newNotification);
        } catch (error) {
          console.error("Error saving notification:", error);
        }
      });
  
      socket.on("markNotificationAsRead", async ({ id }) => {
        try {
          await Notification.findByIdAndUpdate(id, { read: true });
  
          io.emit("notificationRead", { id });
        } catch (error) {
          console.error("Error marking notification as read:", error);
        }
      });
      socket.on('deleteNotification',async({id})=>{
        await Notification.findByIdAndDelete(id)
        io.emit('notificationDelete',{id})
      })
  
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  };

const getNotificationList = async (req, res) => {
     try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: notifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    res.status(500).json({ success: false, message: "Error fetching notifications" })
  }
};

module.exports = { initializeSocket, getNotificationList };
