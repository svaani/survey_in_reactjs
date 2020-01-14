
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Login from './pages/login';
import EndUserLanding from './pages/endUser/endUserLanding';
import EndUserSurvey from './pages/endUser/endUserSurvey';
import EndUserSurveyList from './pages/endUser/endUserSurveyList';

import AdminLanding from './pages/admin/adminLanding';
import CreateQuestion from './pages/admin/createQuestion';
import CreateSurvey from './pages/admin/createSurvey';
import AdminSurveyList from './pages/admin/adminSurveyList';
import Reports from './pages/admin/reports';

const SurveyRouter = ()=>{
    return <Router>
    <div>
      <Route exact path='/' component={Login} />
      <Route path='/login' component={Login} />
      <Route path='/end-user-landing' component={EndUserLanding} />
      <Route path='/end-user-survey/:surveyId/:type' component={EndUserSurvey} />
      <Route path='/end-user-surveylist/:type' component={EndUserSurveyList} />
      
      <Route path='/admin-landing' component={AdminLanding} />
      <Route path='/create-question/:surveyId/:nth' component={CreateQuestion} />
      <Route path='/create-survey/' component={CreateSurvey} />
      <Route path='/admin-surveylist/' component={AdminSurveyList} />
      <Route path='/reports/' component={Reports} />
    </div>
    </Router>
}

export default SurveyRouter;
