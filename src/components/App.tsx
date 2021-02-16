import getFruits from "api/getFruits";
import React, { ReactElement, useCallback } from "react";
import { useQuery } from "react-query";
import {
  BrowserRouter,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import { IFruit } from "types";
import FruitDetails from "./FruitDetails";
import FruitGallery from "./FruitGallery/FruitGallery";

export default function App(): ReactElement {
  const { isLoading, isError, error, data } = useQuery("fruits", getFruits);
  const fruits = data as IFruit[];

  const fruitDetailsRoute = useCallback(
    ({ match }: RouteComponentProps<{ fruitName: string }>) => {
      const { fruitName } = match.params;
      const fruit = fruits.find(
        (f) => f.name.toLowerCase() === fruitName.toLowerCase()
      );
      if (fruit) {
        return <FruitDetails fruit={fruit} />;
      }
      return <Redirect to="/" />;
    },
    [fruits]
  );

  if (isLoading || isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl">
          {isLoading ? "Loading..." : `Error: ${(error as Error).message}`}
        </h1>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <FruitGallery fruits={fruits} />} />
        <Route path="/:fruitName" render={fruitDetailsRoute} />
      </Switch>
    </BrowserRouter>
  );
}
