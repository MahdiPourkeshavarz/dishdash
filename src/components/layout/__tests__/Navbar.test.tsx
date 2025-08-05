/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/useStore";
import { useIsMounted } from "@/hooks/useIsmounted";
import { Navbar } from "@/components/layout/Navbar";
import { Session } from "next-auth";

// --- 1. Mocking All Dependencies ---

jest.mock("next-auth/react");
const mockUseSession = useSession as unknown as jest.Mock;

jest.mock("@/store/useStore");
const mockUseStore = useStore as unknown as jest.Mock;

jest.mock("@/hooks/useIsmounted");
const mockUseIsMounted = useIsMounted as unknown as jest.Mock;

// Mock the UserButton child component
jest.mock("../UserButton", () => ({
  UserButton: () => <div data-testid="user-button-mock">UserButton Mock</div>,
}));

// Mock Next.js components
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("next/image", () => {
  return (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  };
});

describe("Navbar", () => {
  const mockOnLoginClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIsMounted.mockReturnValue(true);
    mockUseStore.mockReturnValue({ theme: "dark" });
  });

  // --- 2. Writing the Tests ---

  test("should render the login button for a guest user", () => {
    mockUseSession.mockReturnValue({ status: "unauthenticated", data: null });
    render(<Navbar onLoginClick={mockOnLoginClick} />);

    const loginButton = screen.getByRole("button", { name: /ورود/i });
    expect(loginButton).toBeInTheDocument();
    expect(screen.queryByTestId("user-button-mock")).not.toBeInTheDocument();
  });

  test("should call onLoginClick when the login button is clicked", () => {
    mockUseSession.mockReturnValue({ status: "unauthenticated", data: null });
    render(<Navbar onLoginClick={mockOnLoginClick} />);

    const loginButton = screen.getByRole("button", { name: /ورود/i });
    fireEvent.click(loginButton);

    expect(mockOnLoginClick).toHaveBeenCalledTimes(1);
  });

  test("should render the UserButton for an authenticated user", () => {
    const mockSession: Session = {
      expires: "1",
      user: {
        id: "123",
        username: "testuser",
        name: "Test User",
        email: "test@example.com",
        image: "test.jpg",
      },
      accessToken: "",
    };
    mockUseSession.mockReturnValue({
      status: "authenticated",
      data: mockSession,
    });
    render(<Navbar onLoginClick={mockOnLoginClick} />);

    expect(screen.getByTestId("user-button-mock")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /ورود/i })
    ).not.toBeInTheDocument();
  });

  test("should not render the login button if the component is not mounted", () => {
    mockUseIsMounted.mockReturnValue(false);
    mockUseSession.mockReturnValue({ status: "unauthenticated", data: null });
    render(<Navbar onLoginClick={mockOnLoginClick} />);

    expect(
      screen.queryByRole("button", { name: /ورود/i })
    ).not.toBeInTheDocument();
  });

  test("should always render the logo and link to the homepage", () => {
    mockUseSession.mockReturnValue({ status: "unauthenticated", data: null });
    render(<Navbar onLoginClick={mockOnLoginClick} />);

    const logoLink = screen.getByRole("link", { name: /dish dash logo/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");

    const logoImage = screen.getByAltText("logo");
    expect(logoImage).toBeInTheDocument();
  });
});
