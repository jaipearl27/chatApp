import { addMessage } from "../controllers/messageController"

let chats = []

// _id - id for the message that MongoDB creted after saving it in the DB

// username - as name suggests name of user that sent the message

// readBy - array of username that tells if this chat has been read or not by the user

// roomId - username 1 + username 2 ... + username n

// message - message content

//reactions - [{'userId','userName', 'reaction'}]

export const addChat = (userId, userName, roomId, message, reactions,readBy) => {
    let message = {}
}


