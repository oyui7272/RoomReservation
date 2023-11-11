export function doGet() {
  return HtmlService.createHtmlOutputFromFile("hosting/index.html")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setTitle("自由部屋 予約システム");
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
  endDate.setHours(23, 59, 59);

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
  roomSheet.getRange(2, 1, lastRow, 4).clearContent();
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

export function getWeekEvents(roomName: string): string[] {
  let roomSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(roomName);
  let weekEvents = [];

  if (roomSheet != null) {
    let lastRow = roomSheet.getLastRow();
    if (lastRow > 1) {
      for (var nowRow = 2; nowRow < lastRow + 1; nowRow++) {
        let title = roomSheet.getRange(nowRow, 3).getDisplayValue();
        let description = roomSheet.getRange(nowRow, 4).getDisplayValue();
        let startTime = roomSheet.getRange(nowRow, 1).getDisplayValue();
        let endTime = roomSheet.getRange(nowRow, 2).getDisplayValue();

        weekEvents.push(title, description, startTime, endTime);
      }
    }
  }
  console.log(weekEvents);
  return weekEvents;
}
