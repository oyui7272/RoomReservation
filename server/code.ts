/**
 * ページを開いた時に最初に呼ばれるルートメソッド
 */
export function doGet() {
  return HtmlService.createHtmlOutputFromFile("hosting/index.html")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setTitle("自由部屋 予約システム");
}

/**
 * 部屋のカレンダーから1週間の予約内容を取得し、Google Spreadsheetに書き込む関数
 * ・引数   roomName: 部屋の名前（F601, F602, F612のいずれか)
 * ・戻り値 なし
 */
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
  let startDate = new Date();
  let endDate = new Date();
  endDate.setDate(startDate.getDate() + 7);
  endDate.setHours(23, 59, 59);

  // Google Calendarより1週間の予定を取得
  let weekEvents = roomCalendar.getEvents(startDate, endDate);

  // Google Spreadsheetの内容を削除
  let roomSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(roomName);
  if (roomSheet === null) {
    console.error("getWeekEvent: シートが存在しません");
    roomSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    roomSheet.setName(roomName);
  }
  let targetRow = 2;
  let lastRow = roomSheet.getLastRow();

  roomSheet.getRange(2, 1, lastRow, 5).clearContent();

  // 取得した情報をGoogle Spreadsheetに書き込み
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
    roomSheet?.getRange(targetRow, 5).setValue(event.getCreators()[0]);
    targetRow++;
  });
}

/**
 * 部屋の状態をGoogle Spreadsheetに書き込む関数
 * ・引数
 * roomName   : 部屋の名前（F601, F602, F612のいずれか),
 * roomStatus : 部屋の使用状況(使用可能, 使用中, 使用不可のいずれか)
 * ・戻り値 なし
 */
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

/**
 * Google Spreadsheetから部屋の1週間の予定を取得する関数
 * ・引数   roomName   : 部屋の名前（F601, F602, F612のいずれか)
 * ・戻り値
 * 1つのイベントにつき[予約タイトル, 予約説明文, 開始時間, 終了時間, イベント作成者]が順に入ったリスト
 */
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
        let creator = roomSheet.getRange(nowRow, 5).getDisplayValue();
        weekEvents.push(title, description, startTime, endTime, creator);
      }
    }
  }
  return weekEvents;
}
