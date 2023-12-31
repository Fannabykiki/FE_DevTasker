import React, { memo, useEffect } from "react";
import { SocketEventHandler } from "@/interfaces/shared/common";
import { API_PATH } from "@/utils/constants";
import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr";

interface Props {
  eventHandlers: SocketEventHandler[];
}

const SIGNALR_URL = `https://devtasker-be.azurewebsites.net/notification`;

function SignalRHandler({ eventHandlers }: Props) {
  useEffect(() => {
    const jwtToken = localStorage.getItem("token");
    if (!jwtToken || eventHandlers.length === 0) {
      return;
    }
    const connection = new HubConnectionBuilder()
      .withUrl(SIGNALR_URL, {
        accessTokenFactory: () => jwtToken,
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();
    connection
      .start()
      .then(() => console.log("Connected to the SignalR Hub"))
      .catch((err) =>
        console.error("Error while establishing connection: ", err)
      );

    eventHandlers.forEach(({ message, handler }) => {
      connection.on(message, handler);
    });

    return () => {
      connection
        .stop()
        .then(() => console.log("Disconnected from the Hub"))
        .catch((err) => console.error("Error while disconnecting: ", err));
    };
  }, [eventHandlers]);

  return <></>;
}

export default memo(SignalRHandler);
