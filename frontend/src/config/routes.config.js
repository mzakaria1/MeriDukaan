import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Login from "../components/public/Login";
import Signup from "../components/public/Signup";
import ResetPassword from "../components/public/ResetPassword";
import Dashboard from "../components/private/Dashboard";
import Profile from "../components/private/Profile";
import AllCollections from "../components/private/Collections/AllCollections";
import CollectionInfo from "../components/private/Collections/CollectionInfo";
import CreateCollection from "../components/private/Collections/CreateCollection";
import AllProducts from "../components/private/Products/AllProducts";
import AddNewProduct from "../components/private/Products/AddNewProduct";
import Orders from "../components/private/Orders";
import Reports from "../components/private/Reports";
import EditProduct from "../components/private/Products/EditProduct";
import ProductInfo from "../components/private/Products/ProductInfo";

export const MainRoutes = ({ authed }) => (
  <Switch>
    <PrivateRoute exact authed={authed} path="/" component={Dashboard} />
    <PrivateRoute authed={authed} path="/profile" component={Profile} />
    <PrivateRoute
      authed={authed}
      path="/collections"
      component={AllCollections}
    />
    <PrivateRoute
      authed={authed}
      path="/newCollectionForm"
      component={CreateCollection}
    />
    <PrivateRoute
      authed={authed}
      path="/collectionInfo"
      component={CollectionInfo}
    />
    <PrivateRoute authed={authed} path="/products" component={AllProducts} />
    <PrivateRoute authed={authed} path="/productInfo" component={ProductInfo} />

    <PrivateRoute
      authed={authed}
      path="/addNewProduct"
      component={AddNewProduct}
    />
    <PrivateRoute authed={authed} path="/orders" component={Orders} />
    <PrivateRoute authed={authed} path="/editProduct" component={EditProduct} />
    <PrivateRoute authed={authed} path="/reports" component={Reports} />

    {/* All the Public Routes access to anybody */}
    <PublicRoute authed={authed} path="/login" component={Login} />
    <PublicRoute authed={authed} path="/signup" component={Signup} />
    <PublicRoute
      authed={authed}
      path="/reset-password"
      component={ResetPassword}
    />
    <Route render={() => <h3>No Match</h3>} />
  </Switch>
);

export function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

export function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authed === false ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}
