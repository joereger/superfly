function make(Schema, mongoose) {
    SlackMessagesSchema = new Schema({
        datetime: Date,
        token: String,
        channel_name: String,
        channel_id: String,
        user_name: String,
        user_id: String,
        text: String
    });
    return mongoose.model('slack_messages', SlackMessagesSchema);
}

module.exports.make = make;
