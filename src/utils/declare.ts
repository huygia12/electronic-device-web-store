import { ProductParams } from "@/types/api/product";
import { ActionFunctionArgs, ParamParseKey, Params } from "react-router-dom";

interface Args extends ActionFunctionArgs {
  params: Params<ParamParseKey<string>> | ProductParams;
}

export type { Args };
