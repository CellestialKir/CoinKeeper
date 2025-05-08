import axios from "axios";

export const FETCH_ACCOUNTS = 'FETCH_ACCOUNTS';
export const ADD_ACCOUNT = 'ADD_ACCOUNT';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const DELETE_ACCOUNT = 'DELETE_ACCOUNT';

const BASE_URL = 'https://681a187b1ac115563507c648.mockapi.io/accounts';
const getUserId = () => localStorage.getItem('user_id');

export const fetchAccounts = () => async (dispatch) => {
    const response = await axios.get(`${BASE_URL}?user_id=${getUserId()}`, {
        withCredentials: false
    });
    dispatch({ type: FETCH_ACCOUNTS, payload: response.data });
};

export const addAccount = (data) => async (dispatch) => {
    const payload = { ...data, user_id: Number(getUserId()) };
    const response = await axios.post(BASE_URL, payload, {
        withCredentials: false
    });
    dispatch({ type: ADD_ACCOUNT, payload: response.data });
};

export const updateAccount = (id, updatedData) => async (dispatch) => {
    const response = await axios.put(`${BASE_URL}/${id}`, updatedData, {
        withCredentials: false
    });
    dispatch({ type: UPDATE_ACCOUNT, payload: response.data });
};

export const deleteAccount = (id) => async (dispatch) => {
    await axios.delete(`${BASE_URL}/${id}`, {
        withCredentials: false
    });
    dispatch({ type: DELETE_ACCOUNT, payload: id });
};