import * as axios from "axios";
import { Dictionary } from "farmbot/dist";

const BASE = "https://openfarm.cc/api/v1/crops/";
export const DATA_URI = "data:image/svg+xml;utf8,";

export const DEFAULT_ICON = "/app-resources/img/generic-plant.svg";

let cache: Dictionary<Axios.IPromise<string>> = {};

export interface OFCropResponse {
  id?: undefined; // ?
  data?: {
    attributes: {
      svg_icon?: string | undefined;
      spread?: number | undefined;
      slug: string;
    } | undefined;
  } | undefined;
}

export class OpenFarmAPI {
  static get OFBaseURL() { return BASE; };
}

/** PROBLEM: You have 100 lettuce plants. You don't want to download an SVG icon
 * 100 times.
 * SOLUTION: Cache stuff. */
export function cachedIcon(slug: string): Axios.IPromise<string> {
  cache[slug] = cache[slug] || (axios
    .get<OFCropResponse>(BASE + slug)
    .then(cacheTheIcon(slug), cacheTheIcon(slug)));
  return cache[slug] as Axios.IPromise<string>;
}

let cacheTheIcon = (slug: string) =>
  (resp: Axios.AxiosXHR<OFCropResponse>) => {
    let text = _.get(resp, "data.data.attributes.svg_icon", "");
    return (text) ? DATA_URI + text : DEFAULT_ICON;
  };
