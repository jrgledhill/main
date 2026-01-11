import { useNavigate, useParams, Link } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { useProduct, useUpdateProduct } from "../hooks/useProducts";
import LoadingSpinner from "../components/LoadingSpinner";
import EditProductForm from "../components/EditProductForm";

/**
 * Renders the product edit page for the authenticated owner of a product.
 *
 * Displays a loading spinner while the product is loading. If the product
 * does not exist or the current user is not the product owner, shows a
 * not-found or access-denied card with a link back home. If the product
 * exists and the user is authorized, renders an EditProductForm and submits
 * updates via the updateProduct mutation, navigating to the product detail
 * page on success.
 *
 * @returns {JSX.Element} The page UI: loading spinner, access card, or edit form.
 */
function EditProductPage() {
  const { id } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const { data: product, isLoading } = useProduct(id);
  const updateProduct = useUpdateProduct();

  if (isLoading) return <LoadingSpinner />;

  if (!product || product.userId !== userId) {
    return (
      <div className="card bg-base-300 max-w-md mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">{!product ? "Not found" : "Access denied"}</h2>
          <Link to="/" className="btn btn-primary btn-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <EditProductForm
      product={product}
      isPending={updateProduct.isPending}
      isError={updateProduct.isError}
      onSubmit={(formData) => {
        updateProduct.mutate(
          { id, ...formData },
          {
            onSuccess: () => navigate(`/product/${id}`),
          }
        );
      }}
    />
  );
}

export default EditProductPage;