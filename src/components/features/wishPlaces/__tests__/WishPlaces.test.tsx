import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useStore } from "@/store/useStore";
import { usePopulatedWishlist } from "@/hooks/usePopulatedWishlist";
import { WishPlacesModal } from "../WishPlaces";

jest.mock("@/store/useStore");
const mockUseStore = useStore as unknown as jest.Mock;

jest.mock("@/hooks/usePopulatedWishlist");
const mockUsePopulatedWishlist = usePopulatedWishlist as jest.Mock;

const mockWishlistData = [
  { _id: "1", tags: { name: "Good Restaurant", amenity: "restaurant" } },
  { _id: "2", tags: { name: "Awesome Cafe", amenity: "cafe" } },
  { _id: "3", tags: { name: "Another Restaurant", amenity: "restaurant" } },
];

describe("WishPlacesModal", () => {
  const mockOnClose = jest.fn();
  const mockSetFlyToTarget = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseStore.mockReturnValue({
      theme: "dark",
      setFlyToTarget: mockSetFlyToTarget,
      user: null,
    });

    mockUsePopulatedWishlist.mockReturnValue({
      data: [],
      isLoading: false,
    });
  });

  test("should render nothing when isOpen is false", () => {
    render(<WishPlacesModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test('should show "please log in" message for a guest user', () => {
    render(<WishPlacesModal isOpen={true} onClose={mockOnClose} />);
    expect(
      screen.getByText("لطفا وارد حساب کاربری خود شوید")
    ).toBeInTheDocument();
  });

  test("should show a loading spinner for a logged-in user while data is fetching", () => {
    mockUseStore.mockReturnValue({
      theme: "dark",
      setFlyToTarget: mockSetFlyToTarget,
      user: { id: "123", username: "testuser" },
    });

    mockUsePopulatedWishlist.mockReturnValue({
      data: [],
      isLoading: true,
    });

    render(<WishPlacesModal isOpen={true} onClose={mockOnClose} />);
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  test("should display wishlist items for a logged-in user", () => {
    mockUseStore.mockReturnValue({
      theme: "dark",
      setFlyToTarget: mockSetFlyToTarget,
      user: { id: "123", username: "testuser" },
    });

    mockUsePopulatedWishlist.mockReturnValue({
      data: mockWishlistData,
      isLoading: false,
    });

    render(<WishPlacesModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("Good Restaurant")).toBeInTheDocument();
    expect(screen.getByText("Another Restaurant")).toBeInTheDocument();
    expect(screen.queryByText("Awesome Cafe")).not.toBeInTheDocument();
  });

  test("should filter items when a different tab is clicked", () => {
    mockUseStore.mockReturnValue({
      theme: "dark",
      setFlyToTarget: mockSetFlyToTarget,
      user: { id: "123", username: "testuser" },
    });

    mockUsePopulatedWishlist.mockReturnValue({
      data: mockWishlistData,
      isLoading: false,
    });

    render(<WishPlacesModal isOpen={true} onClose={mockOnClose} />);

    const cafeTabButton = screen.getByRole("button", { name: /کافه/i });
    fireEvent.click(cafeTabButton);

    expect(screen.getByText("Awesome Cafe")).toBeInTheDocument();
    expect(screen.queryByText("Good Restaurant")).not.toBeInTheDocument();
  });

  test("should call setFlyToTarget and onClose when a map icon is clicked", () => {
    mockUseStore.mockReturnValue({
      theme: "dark",
      setFlyToTarget: mockSetFlyToTarget,
      user: { id: "123", username: "testuser" },
    });

    mockUsePopulatedWishlist.mockReturnValue({
      data: mockWishlistData,
      isLoading: false,
    });

    render(<WishPlacesModal isOpen={true} onClose={mockOnClose} />);

    const mapButton = screen.getByRole("button", {
      name: /navigate to good restaurant/i,
    });
    fireEvent.click(mapButton);

    expect(mockSetFlyToTarget).toHaveBeenCalledWith(mockWishlistData[0]);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('should show "empty list" message when the wishlist is empty for a logged-in user', () => {
    mockUseStore.mockReturnValue({
      theme: "dark",
      setFlyToTarget: mockSetFlyToTarget,
      user: { id: "123", username: "testuser" },
    });

    mockUsePopulatedWishlist.mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<WishPlacesModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("لیست خالی است")).toBeInTheDocument();
  });
});
