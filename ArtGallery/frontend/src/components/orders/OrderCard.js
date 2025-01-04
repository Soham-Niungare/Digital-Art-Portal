import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-500';
    case 'CONFIRMED':
      return 'bg-blue-500';
    case 'PAID':
      return 'bg-green-500';
    case 'SHIPPED':
      return 'bg-purple-500';
    case 'DELIVERED':
      return 'bg-green-700';
    case 'CANCELLED':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export default function OrderCard({ order, onStatusUpdate, userRole }) {
  const canUpdateStatus = ['admin', 'artist'].includes(userRole);
  
  const getNextStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case 'PENDING':
        return ['CONFIRMED', 'CANCELLED'];
      case 'CONFIRMED':
        return ['PAID', 'CANCELLED'];
      case 'PAID':
        return ['SHIPPED'];
      case 'SHIPPED':
        return ['DELIVERED'];
      default:
        return [];
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
          <Badge className={getStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="font-medium text-gray-800">Artwork</h4>
          <p>{order.artwork.title}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-800">Customer</h4>
          <p>{order.customer.name}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-800">Shipping Address</h4>
          <p className="text-sm">{order.shippingAddress}</p>
        </div>
        {order.additionalNotes && (
          <div>
            <h4 className="font-medium">Additional Notes</h4>
            <p className="text-sm">{order.additionalNotes}</p>
          </div>
        )}
      </CardContent>
      {canUpdateStatus && getNextStatusOptions(order.status).length > 0 && (
        <CardFooter className="justify-end space-x-2">
          {getNextStatusOptions(order.status).map(status => (
            <Button
              key={status}
              variant={status === 'CANCELLED' ? 'destructive' : 'secondary'}
              onClick={() => onStatusUpdate(order.id, status)}
            >
              Mark as {status}
            </Button>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}