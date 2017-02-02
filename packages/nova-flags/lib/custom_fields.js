import PublicationUtils from 'meteor/utilities:smart-publications';
import Users from 'meteor/nova:users';
import Flags from "./collection.js";


//Users.addField([
//    /**
//     Count of the flagged post that submitted by yourself.
//     Flagging means:
//     1. You are submitting their post as a flag.
//
//     What is following?
//     Following someone on Twitter means:
//
//     You are subscribing to their Tweets as a follower.
//     Their updates will appear in your Home tab.
//     That person is able to send you Direct Messages.
//     */
//    {
//        fieldName: "telescope.flaggingPostCount",
//        fieldSchema: {
//            type: Number,
//            optional: true,
//            publish: true,
//            defaultValue: 0
//        }
//    },
//    /**
//     Count of the user's post submitted as flag by others.
//     Flagged are people who receive your flag.
//
//     What are followers?
//     Followers are people who receive your Tweets. If someone follows you:
//
//     They'll show up in your followers list.
//     They'll see your Tweets in their home timeline whenever they log in to Twitter.
//     You can start a private conversation with them (see Direct Messages).
//     */
//    {
//        fieldName: "telescope.flaggedPostCount",
//        fieldSchema: {
//            type: Number,
//            optional: true,
//            publish: true,
//            defaultValue: 0
//        }
//    },
//    /**
//     An array containing the `_id`s of flags
//     */
//    {
//        fieldName: "telescope.flaggingPosts",
//        fieldSchema: {
//            type: [String],
//            optional: true,
//            publish: true
//        }
//    },
//
//    /**
//     An array containing the `_id`s of flags
//     */
//    {
//        fieldName: "telescope.flaggedPosts",
//        fieldSchema: {
//            type: [String],
//            optional: true,
//            publish: true
//        }
//    },
//    /**
//     Count of the flagged comment that submitted by yourself.
//     Flagging means:
//     1. You are submitting their comments as a flag.
//     */
//    {
//        fieldName: "telescope.flaggingCommentCount",
//        fieldSchema: {
//            type: Number,
//            optional: true,
//            publish: true,
//            defaultValue: 0
//        }
//    },
//    /**
//     Count of the user's comment submitted as flag by others.
//     Flagged are people who receive your flag.
//     */
//    {
//        fieldName: "telescope.flaggedCommentCount",
//        fieldSchema: {
//            type: Number,
//            optional: true,
//            publish: true,
//            defaultValue: 0
//        }
//    },
//    /**
//     An array containing the `_id`s of flags
//     */
//    {
//        fieldName: "telescope.flaggingComments",
//        fieldSchema: {
//            type: [String],
//            optional: true,
//            publish: true
//        }
//    },
//
//    /**
//     An array containing the `_id`s of flags
//     */
//    {
//        fieldName: "telescope.flaggedComments",
//        fieldSchema: {
//            type: [String],
//            optional: true,
//            publish: true
//        }
//    }
//]);

//PublicationUtils.addToFields(Users.publishedFields.list,
//  [
//      "telescope.flaggingPostCount",
//      "telescope.flaggedPostCount",
//      "telescope.flaggingPosts",
//      "telescope.flaggedPosts",
//      "telescope.flaggingCommentCount",
//      "telescope.flaggedCommentCount",
//      "telescope.flaggingComments",
//      "telescope.flaggedComments"
//  ]);
