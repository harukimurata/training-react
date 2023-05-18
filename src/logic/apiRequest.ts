import axios from "axios";
import {
  type MatchTableCreateForm,
  type MatchTableGetForm,
  type MatchTableResponse,
} from "../types/MatchTable";
import { type MatchTableInfoUpdateForm } from "../types/MatchTableInfo";
const API_URL = "http://localhost:3000";

/**
 * 大会情報取得
 * @param data
 * @returns
 */
export async function getMatchTable(
  data: MatchTableGetForm
): Promise<MatchTableResponse> {
  const result = await axios.post(`${API_URL}/matchTable`, data);
  return result.data;
}

/**
 * 大会情報作成
 * @param data
 * @returns
 */
export async function createMatchTable(
  data: MatchTableCreateForm
): Promise<any> {
  const result = await axios.post(`${API_URL}/matchTableData`, data);
  return result.data;
}

/**
 * 大会情報更新
 * @param data
 * @returns
 */
export async function updateMatchTable(
  data: MatchTableInfoUpdateForm
): Promise<any> {
  const result = await axios.patch(`${API_URL}/matchTableData`, data);
  return result.data;
}
