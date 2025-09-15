const { Types } = require("mongoose");

const mentorshipRequests = [
  {
    _id: new Types.ObjectId(),
    mentee_id: new Types.ObjectId("650f1c2a3f1d2a001f9d1001"), // Student user
    mentor_id: new Types.ObjectId("650f1c2a3f1d2a001f9d2001"), // Alumni mentor
    status: "requested"
  },
  {
    _id: new Types.ObjectId(),
    mentee_id: new Types.ObjectId("650f1c2a3f1d2a001f9d1002"),
    mentor_id: new Types.ObjectId("650f1c2a3f1d2a001f9d2002"),
    status: "accepted"
  },
  {
    _id: new Types.ObjectId(),
    mentee_id: new Types.ObjectId("650f1c2a3f1d2a001f9d1003"),
    mentor_id: new Types.ObjectId("650f1c2a3f1d2a001f9d2003"),
    status: "declined"
  },
  {
    _id: new Types.ObjectId(),
    mentee_id: new Types.ObjectId("650f1c2a3f1d2a001f9d1004"),
    mentor_id: new Types.ObjectId("650f1c2a3f1d2a001f9d2004"),
    status: "withdrawn"
  },
  {
    _id: new Types.ObjectId(),
    mentee_id: new Types.ObjectId("650f1c2a3f1d2a001f9d1005"),
    mentor_id: new Types.ObjectId("650f1c2a3f1d2a001f9d2005"),
    status: "requested"
  },
  {
    _id: new Types.ObjectId(),
    mentee_id: new Types.ObjectId("650f1c2a3f1d2a001f9d1006"),
    mentor_id: new Types.ObjectId("650f1c2a3f1d2a001f9d2001"),
    status: "accepted"
  },
  {
    _id: new Types.ObjectId(),
    mentee_id: new Types.ObjectId("650f1c2a3f1d2a001f9d1007"),
    mentor_id: new Types.ObjectId("650f1c2a3f1d2a001f9d2002"),
    status: "requested"
  },
  {
    _id: new Types.ObjectId(),
    mentee_id: new Types.ObjectId("650f1c2a3f1d2a001f9d1008"),
    mentor_id: new Types.ObjectId("650f1c2a3f1d2a001f9d2003"),
    status: "declined"
  },
  {
    _id: new Types.ObjectId(),
    mentee_id: new Types.ObjectId("650f1c2a3f1d2a001f9d1009"),
    mentor_id: new Types.ObjectId("650f1c2a3f1d2a001f9d2004"),
    status: "requested"
  },
  {
    _id: new Types.ObjectId(),
    mentee_id: new Types.ObjectId("650f1c2a3f1d2a001f9d1010"),
    mentor_id: new Types.ObjectId("650f1c2a3f1d2a001f9d2005"),
    status: "accepted"
  }
];

module.exports = mentorshipRequests;
