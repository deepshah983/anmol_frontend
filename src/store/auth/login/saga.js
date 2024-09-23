import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
} from "../../../helpers/fakebackend_helper";

const fireBaseBackend = getFirebaseBackend();

function* loginUser({ payload: { user, history } }) {
  console.log(import.meta.env.VITE_APP_DEFAULTAUTH);
  
  try {
    if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(
        fireBaseBackend.loginUser,
        user.email,
        user.password
      );
      yield put(loginSuccess(response));
    } else if (import.meta.env.VITE_APP_DEFAULTAUTH === "jwt") {
      
      const response = yield call(postJwtLogin, {
        email: user.email,
        password: user.password,
      });

      if(response.success){
        // Store tokens and user data in localStorage
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("authUser", JSON.stringify(response.user));
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
        
        // Dispatch login success action
        yield put(loginSuccess(response));
      } else {
        // Dispatch API error action
        yield put(apiError(response.msg));
      }
      
    } else if (import.meta.env.VITE_APP_DEFAULTAUTH === "fake") {
      const response = yield call(postFakeLogin, {
        email: user.email,
        password: user.password,
      });
      
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
    }
  } catch (error) {
    yield put(apiError(error.message));
  }
}


function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem('authUser')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessToken')

    if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout);
      yield put(logoutUserSuccess(response));
    }
    history('/login');
  } catch (error) {
    yield put(apiError(error));
  }
}

function* socialLogin({ payload: { type, history } }) {
  try {
    if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      const response = yield call(fireBaseBackend.socialLoginUser, type);
      if (response) {
        history("/dashboard");
      } else {
        history("/login");
      }
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginSuccess(response));
      if(response)
      history("/dashboard");
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
