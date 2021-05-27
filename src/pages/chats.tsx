import React, { useState } from "react";
import { useGetUsersLazyQuery, useGetUsersQuery } from "../generated/graphql";
import { Text } from "../components/atomic";
import { useAuth } from "../../utils/firebase/auth";

enum ChatType {
  UPCOMING = "upcoming",
  PENDING = "pending",
  PAST = "past"
}

const ChatsList = (chatsData) => {
  return(
    <Card>
          <h2>Upcoming Chats</h2>
          <table>
              {for chat in chatsData}
              <tr>
                  <td>{chat.User}</td>
                  <td>{chat.Time}</td>
              </tr>
          </table>
      </Card>
  );
}

const ChatsPage = () => {
  const [getUser, { data }] = useGetUsersLazyQuery();
  const { auth, signOut } = useAuth();

  // render chats in rows of upcoming, pending (new | rescheduled?), or past
  // each row contains name of other, time, details
  // render details modal with name, time, location, msg, view profile
  //    if upcoming chat: reschedule or cancel option if upcoming chat

  const selectedChatsData;
  return (
    <>
      <h1>My Chats</h1>
      <Text>Upcoming</Text>
      <Text>Pending</Text>
      <Text>Past</Text>
      {ChatsList(selectedChatsData)} {/* render whichever list of chats waas selected */}
    </>
  );
};

export default ChatsPage;
