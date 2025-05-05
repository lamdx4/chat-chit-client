export default class Reaction {
    reactionId: number;
    userId: number;
    messageId: number;
    type: number;
    constructor(idReaction: number,
        memberId: number,
        messageId: number,
        type: number) {
        this.reactionId = idReaction;
        this.userId = memberId;
        this.messageId = messageId;
        this.type = type;   
    }
}