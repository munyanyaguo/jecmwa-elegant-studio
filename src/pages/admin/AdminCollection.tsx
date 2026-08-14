import { useParams } from "react-router-dom";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { COLLECTIONS } from "@/lib/admin/collections";

const AdminCollection = () => {
  const { collection } = useParams<{ collection: string }>();
  const config = collection ? COLLECTIONS[collection] : undefined;

  if (!config) {
    return (
      <p className="border border-hairline py-12 text-center text-caption text-muted-foreground">
        Unknown section.
      </p>
    );
  }

  return <CollectionEditor key={config.key} config={config} />;
};

export default AdminCollection;
