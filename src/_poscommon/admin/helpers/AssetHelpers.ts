import { useLayout } from "../layout/core";
import { ThemeModeComponent } from "../assets/ts/layout";
import { APP_BASE_URL, API_BASE_URL } from "../../common/constants/Config";
import { stringIsNullOrWhiteSpace } from "../../common/helpers/global/ValidationHelper";

export const toAbsoluteUrl = (pathname: string) =>{
  return APP_BASE_URL + pathname;
}

export const toAbsoluteUrlCustom = (pathname: string) =>{
  return API_BASE_URL + pathname;
}




export const useIllustrationsPath = (illustrationName: string): string => {
  const { config } = useLayout();

  const extension = illustrationName.substring(
    illustrationName.lastIndexOf("."),
    illustrationName.length
  );
  const illustration =
    ThemeModeComponent.getMode() === "dark"
      ? `${illustrationName.substring(
          0,
          illustrationName.lastIndexOf(".")
        )}-dark`
      : illustrationName.substring(0, illustrationName.lastIndexOf("."));
  return toAbsoluteUrl(
    `media/illustrations/${config.illustrations?.set}/${illustration}${extension}`
  );
};
