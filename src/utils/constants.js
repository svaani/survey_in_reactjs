import React from 'react';
/* Most of the constants are saved in one file as the project is not huge
*/
const Constants = {
     
     SURVEY : "Survey",
     SURVEYS : "Surveys",

     ROLES : {
         ADMIN : "Admin",
         SUPER_ADMIN : "Super_Admin",
         END_USER : "End_User"
     },

     SURVEY_STATUS : {
         CLOSED : "closed",
         DRAFT : "draft",
         OPEN : "open"
     },

     ERR : {
        NO_ANSWER_ERROR :"No answers entered",
        NAME_MANDATORY : "Name is Mandatory",
        BLANK_ANSWER : "No answers added",
        BLANK_QUESTION : "Question is blank",
        WRONG_SURVEY_TYPE : "wrong survey type"
     },

     ALERT : {
         SAVED : "Record Saved"
     },

     TITLE : {
         WELCOME :"Welcome",
         REPORTS : "Reports",
         DAYS_VS_NUMBERS:"Days VS Survey Numbers",
         ANS_REPORT:"Answer Report",
         ALL_SURVEYS : "All Surveys",
         ADD_QUESTIONS :"Add Questions To Survey",
         CREATE_SURVEY: "Create Survey"
     },

     BUTTON :{
        LOGIN : "Login",
        SAVE_DRAFT:"Save Draft",
        SUBMIT : "Submit",
        SAVE_ADD_QUESTIONS :"Save And Go to Add Questions",
        ADD: "Add",
        NEXT: "Next",
        SAVE_EXIT : "Save & Exit"
     },

     LABEL : {
         CREATE_SURVEY : "Create Survey",
         SURVEY_LIST : "Survey List",
         REPORTS : "Reports",
         MULTICHOICE_ALLOWED :"Is Multichoice Allowed?",
         IS_DEPENDED : "Is Depended On Last Question",
         DESCRIPTION : "Description",
         SURVEY_NAME : "Survey Name",
         ADD_QUESTION : "Add Question"
     }
   
}

export default Constants;