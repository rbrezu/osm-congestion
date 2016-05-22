package osm.maps.congestion.service.servers;

/**
 * Created by root on 15.05.2016.
 */
public class BBox {
    private double left;
    private double right;
    private double top;
    private double bottom;

    public BBox (double left, double bottom, double right, double top) {
        this.left = left;
        this.bottom = bottom;
        this.right = right;
        this.top = top;
    }

    public double getLeft() {
        return left;
    }

    public void setLeft(double left) {
        this.left = left;
    }

    public double getRight() {
        return right;
    }

    public void setRight(double right) {
        this.right = right;
    }

    public double getTop() {
        return top;
    }

    public void setTop(double top) {
        this.top = top;
    }

    public double getBottom() {
        return bottom;
    }

    public void setBottom(double bottom) {
        this.bottom = bottom;
    }

    @Override
    public String toString() {
        return left +
            "," + bottom +
            "," + right +
            "," + top;
    }

    public BBox[][] parseIntoMatrix() {
        BBox[][] bbmatrix = new BBox[2][2];

        bbmatrix[0][0] = new BBox(left, bottom, (left + right) / 2, (bottom + top) / 2);
        bbmatrix[0][1] = new BBox((left + right) / 2, bottom, right, (bottom + top) / 2);
        bbmatrix[1][0] = new BBox(left, (bottom + top) / 2, (left + right) / 2, top);
        bbmatrix[1][1] = new BBox((left + right) / 2, (bottom + top) / 2, right, top);

        return bbmatrix;
    }
}
