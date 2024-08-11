import { ProductParams } from "@/types/api/product";
import { ActionFunctionArgs, ParamParseKey, Params } from "react-router-dom";

interface Args extends ActionFunctionArgs {
  params: Params<ParamParseKey<string>> | ProductParams;
}

type Optional<T> = T | undefined;

type Nullable<T> = T | null;

export type { Args, Optional, Nullable };
