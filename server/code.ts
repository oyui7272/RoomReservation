export function doGet() {
  return HtmlService.createHtmlOutputFromFile("hosting/index.html")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setTitle("Today's Schedule");
}

// 1週間の予約内容を確認する関数
export function writeWeekEvent(roomName: string) {
  let roomCalendarID = "";
  if (roomName === "F601") {
    roomCalendarID =
      "c.info.eng.osaka-cu.ac.jp_2d3439333239363534323234@resource.calendar.google.com";
  } else if (roomName === "F602") {
    roomCalendarID =
      "c_18869quv40nsmio4i34usqel83bea@resource.calendar.google.com";
  } else if (roomName === "F612") {
    roomCalendarID =
      "c_188agk713pnv2j2el3a3apchsbi3u@resource.calendar.google.com";
  } else {
    console.error("updateRoomState: 無効な引数です");
  }
  let roomCalendar = CalendarApp.getCalendarById(roomCalendarID);

  // startDate: 今の日時  endDate: 1週間後の日時
  // todayEvents: startDate ~ endDateの間の全ての予約状況
  let startDate = new Date();
  let endDate = new Date();
  endDate.setDate(startDate.getDate() + 7);

  // 1週間の予定を取得して、SpreadSheetに書き込む
  let weekEvents = roomCalendar.getEvents(startDate, endDate);
  let roomSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(roomName);
  if (roomSheet === null) {
    console.error("getWeekEvent: シートが存在しません");
    roomSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    roomSheet.setName(roomName);
  }

  let targetRow = 2;
  let lastRow = roomSheet.getLastRow();

  // 内容を削除→更新
  roomSheet.getRange(2, 1, lastRow, 3).clearContent();
  weekEvents.forEach((event) => {
    let set_startTime = Utilities.formatDate(
      event.getStartTime(),
      "JST",
      "yyyy/MM/dd HH:mm:ss"
    );
    let set_endTime = Utilities.formatDate(
      event.getEndTime(),
      "JST",
      "yyyy/MM/dd HH:mm:ss"
    );
    roomSheet?.getRange(targetRow, 1).setValue(set_startTime);
    roomSheet?.getRange(targetRow, 2).setValue(set_endTime);
    roomSheet?.getRange(targetRow, 3).setValue(event.getTitle());
    roomSheet?.getRange(targetRow, 4).setValue(event.getDescription());
    targetRow++;
  });
}

// 次の予約内容を返す関数
export function getNextEvent(roomName: string): {
  nextEvent_startTime: string;
  nextEvent_endTime: string;
  nextEvent_title: string;
  nextEvent_description: string;
} {
  let roomSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(roomName);
  let nextEvent_startTime = "";
  let nextEvent_endTime = "";
  let nextEvent_title = "";
  let nextEvent_description = "";
  if (roomSheet != null) {
    nextEvent_startTime = roomSheet.getRange(2, 1).getDisplayValue();
    nextEvent_endTime = roomSheet.getRange(2, 2).getDisplayValue();
    nextEvent_title = roomSheet.getRange(2, 3).getDisplayValue();
    nextEvent_description = roomSheet.getRange(2, 4).getDisplayValue();
  }
  return {
    nextEvent_startTime,
    nextEvent_endTime,
    nextEvent_title,
    nextEvent_description,
  };
}

// 現在の部屋の状態を返す関数
// 引数：roonName("F601", "F602", "F612"のいずれか)
// export function getRoomStatus(roomName: string) {
//   let roomSheet =
//     SpreadsheetApp.getActiveSpreadsheet().getSheetByName(roomName);

//   let {
//     nextEvent_startTime,
//     nextEvent_endTime,
//     nextEvent_title,
//     nextEvent_description,
//   } = getNextEvent(roomName);

//   // roomStatus: 現在の部屋の状態を返す変数（空室、使用中、使用不可）
//   // スプレッドシートの状態を更新
//   // ■ 判断方法（直近のイベントの開始時刻を見る）
//   // ・今行われているイベントがない → 空室
//   // ・今行われているイベントがあり、そのイベントの説明文に「入室可能」という言葉がある → 使用中
//   // ・今行われているイベントがある → 使用不可

//   let nowDate = new Date();
//   let roomStatus = "空室";

//   if (nextEvent_startTime !== "" && nextEvent_endTime !== "") {
//     let eventStartDate = Utilities.parseDate(
//       nextEvent_startTime,
//       "JST",
//       "yyyy/MM/dd HH:mm:ss"
//     );
//     let eventEndDate = Utilities.parseDate(
//       nextEvent_endTime,
//       "JST",
//       "yyyy/MM/dd HH:mm:ss"
//     );

//     let diff1_ms = nowDate.getTime() - eventStartDate.getTime();
//     let diff2_ms = eventEndDate.getTime() - nowDate.getTime();
//     if (diff1_ms > 0 && diff2_ms > 0) {
//       roomStatus = "使用不可";
//       if (nextEvent_description.includes("入室可能")) {
//         roomStatus = "使用中";
//       }
//     }
//   }

//   let statusSheet =
//     SpreadsheetApp.getActiveSpreadsheet().getSheetByName("現在の状態");
//   if (statusSheet === null) {
//     console.error("getWeekEvent: シートが存在しません");
//   } else {
//     let targetRow = 5;
//     if (roomName === "F601") {
//       targetRow = 2;
//     } else if (roomName === "F602") {
//       targetRow = 3;
//     } else if (roomName === "F612") {
//       targetRow = 4;
//     }
//     if (targetRow <= 4) {
//       // 内容を更新
//       statusSheet?.getRange(targetRow, 2).setValue(roomStatus);
//     }
//   }
//   return roomStatus;
// }

export function writeRoomStatus(roomName: string, roomStatus: string) {
  let statusSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("現在の状態");
  if (statusSheet === null) {
    console.error("getWeekEvent: シートが存在しません");
  } else {
    let targetRow = 5;
    if (roomName === "F601") {
      targetRow = 2;
    } else if (roomName === "F602") {
      targetRow = 3;
    } else if (roomName === "F612") {
      targetRow = 4;
    }
    if (targetRow <= 4) {
      // 内容を更新
      statusSheet?.getRange(targetRow, 2).setValue(roomStatus);
    }
  }
}
