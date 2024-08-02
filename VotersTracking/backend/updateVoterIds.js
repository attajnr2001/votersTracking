import mongoose from "mongoose";
import GroupMember from "./models/GroupMember.js";
import dotenv from "dotenv";

dotenv.config();

const generateVoterId = async () => {
  const characters = "";
  let result = "";
  for (let i = 0; i < 1; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const existingMember = await GroupMember.findOne({ voterId: result });
  if (existingMember) {
    return generateVoterId();
  }

  return result;
};

const updateVoterIds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    const membersWithoutVoterId = await GroupMember.find({
      voterId: { $exists: false },
    });

    console.log(
      `Found ${membersWithoutVoterId.length} members without voterId`
    );

    for (const member of membersWithoutVoterId) {
      member.voterId = await generateVoterId();
      await member.save();
      console.log(
        `Updated member ${member._id} with voterId ${member.voterId}`
      );
    }

    console.log("Finished updating voterIds");
  } catch (error) {
    console.error("Error updating voterIds:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

updateVoterIds();
