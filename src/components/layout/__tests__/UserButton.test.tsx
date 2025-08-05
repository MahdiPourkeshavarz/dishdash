/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UserButton } from "../UserButton";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/useStore";
import { Session } from "next-auth";
import { useIsMounted } from "@/hooks/useIsmounted";

jest.mock("next-auth/react");
const mockUseSession = useSession as unknown as jest.Mock;

jest.mock("@/store/useStore");
const mockUseStore = useStore as unknown as jest.Mock;

jest.mock("@/hooks/useIsmounted");
const mockUseIsMounted = useIsMounted as unknown as jest.Mock;

jest.mock("../../features/user/ProfileModal", () => ({
  ProfileModal: () => <div data-testid="profile-modal-mock" />,
}));

// Mock Next.js components
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt || "User"} />,
}));

const mockSession: Session = {
  expires: "1",
  user: {
    id: "123",
    username: "testuser",
    name: "Test User",
    email: "test@example.com",
    image: "/test-photo.jpg",
  },
  accessToken: "",
};

describe("UserButton", () => {
  const mockToggleProfileModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseStore.mockReturnValue({
      isProfileModalOpen: false,
      toggleProfileModal: mockToggleProfileModal,
    });
    mockUseIsMounted.mockReturnValue(true);
  });

  test("should render null if user is not authenticated", () => {
    mockUseSession.mockReturnValue({ status: "unauthenticated", data: null });
    const { container } = render(<UserButton />);
    expect(container.firstChild).toBeNull();
  });

  test("should render the user image when authenticated", () => {
    mockUseSession.mockReturnValue({
      status: "authenticated",
      data: mockSession,
    });
    render(<UserButton />);
    const userImage = screen.getByAltText("Test User");
    expect(userImage).toBeInTheDocument();
  });

  describe("on a desktop device", () => {
    beforeEach(() => {
      Object.defineProperty(window, "ontouchstart", {
        value: undefined,
      });
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 0,
      });
    });

    test("should show user name on hover", async () => {
      mockUseSession.mockReturnValue({
        status: "authenticated",
        data: mockSession,
      });
      render(<UserButton />);

      const button = screen.getByRole("button");
      fireEvent.mouseEnter(button);

      await waitFor(() => {
        expect(screen.getByText("Test User")).toBeInTheDocument();
      });

      fireEvent.mouseLeave(button);
      await waitFor(() => {
        expect(screen.queryByText("Test User")).not.toBeInTheDocument();
      });
    });

    test("should call toggleProfileModal on click", () => {
      mockUseSession.mockReturnValue({
        status: "authenticated",
        data: mockSession,
      });
      render(<UserButton />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockToggleProfileModal).toHaveBeenCalledTimes(1);
    });
  });

  describe("on a touch device", () => {
    beforeEach(() => {
      Object.defineProperty(window, "ontouchstart", {
        value: {},
      });
    });

    test("should show name on first tap and open modal on second tap", async () => {
      mockUseSession.mockReturnValue({
        status: "authenticated",
        data: mockSession,
      });
      render(<UserButton />);

      const button = screen.getByRole("button");

      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByText("Test User")).toBeInTheDocument();
      });
      expect(mockToggleProfileModal).not.toHaveBeenCalled();

      fireEvent.click(button);
      expect(mockToggleProfileModal).toHaveBeenCalledTimes(1);
    });

    test("should hide the user name when the profile modal is closed", async () => {
      mockUseSession.mockReturnValue({
        status: "authenticated",
        data: mockSession,
      });
      const { rerender } = render(<UserButton />);

      const button = screen.getByRole("button");

      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByText("Test User")).toBeInTheDocument();
      });

      mockUseStore.mockReturnValue({
        isProfileModalOpen: false,
        toggleProfileModal: mockToggleProfileModal,
      });
      rerender(<UserButton />);

      await waitFor(() => {
        expect(screen.queryByText("Test User")).not.toBeInTheDocument();
      });
    });
  });
});
