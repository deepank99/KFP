public with sharing class Q3{
    //  Public Static Integer DateMethod(Date d1 , Date d2){
      //    Date StartDate = Date.newInstance(2023,2,1);
        //  Date DueDate = Date.newInstance(2023,2,26);
          //Integer numberDaysDue = StartDate.daysBetween(DueDate);
          //System.debug('Days Difference' + numberDaysDue);
          //return numberDaysDue;
      //}
  //}
  
  public static Integer daysInBetweenExcludingWeekends (Datetime StartDate, Datetime EndDate){
      Integer days = StartDate.date().daysBetween(endDate.Date());
      days = ((integer)Math.floor((days / 7)) * 2) ;   
  
      if (StartDate.format('E') != 'Sat') {
          days -= 1;
      } else if(StartDate.format('E') != 'Sun'){
          days -=2;
      }
      return days;
      }
  }   