export function doGet() {
  return HtmlService.createHtmlOutputFromFile("hosting/index.html")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setTitle("Today's Schedule");
}

// 現在の部屋の状態を返す関数
// 引数：roonName("F601", "F602", "F612"のいずれか)
export function getRoomStatus(roomName: string) {
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

  // startDate: 今の日時  endDate: 24時間後の日時
  // todayEvents: startDate ~ endDateの間の全ての予約状況
  let startDate = new Date();
  let endDate = new Date();
  endDate.setDate(startDate.getDate() + 1);
  let todayEvents = roomCalendar.getEvents(startDate, endDate);

  // roomStatus: 現在の部屋の状態を返す変数（空室、使用中、使用不可）
  // ■ 判断方法
  // ・24時間以内の予約がない or 今行われているイベントがない → 空室
  // ・今行われているイベントがあり、そのイベントの説明文に「使用中ですが、入室可能です」という言葉がある → 使用中
  // ・今行われているイベントがある → 使用不可
  let roomStatus = "空室";
  if (todayEvents.length != 0) {
    let todayFirstEvent = todayEvents[0];
    let diff1_ms =
      startDate.getTime() - todayFirstEvent.getStartTime().getTime();
    let diff2_ms = todayFirstEvent.getEndTime().getTime() - startDate.getTime();
    if (diff1_ms > 0 && diff2_ms > 0) {
      roomStatus = "使用不可";
      if (
        todayFirstEvent.getDescription().includes("使用中ですが、入室可能です")
      ) {
        roomStatus = "使用中";
      }
    }
  }
  return roomStatus;
}
