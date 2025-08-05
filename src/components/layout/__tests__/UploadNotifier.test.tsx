import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UploadNotifier } from "../UploadNotifier";
import { useStore } from "@/store/useStore";
import { UploadStatus } from "@/store/useStore";

jest.mock("@/store/useStore");
const mockUseStore = useStore as unknown as jest.Mock;

jest.mock("lucide-react", () => ({
  ...jest.requireActual("lucide-react"),
  Loader: () => <div data-testid="loader-icon" />,
  CheckCircle: () => <div data-testid="success-icon" />,
  AlertTriangle: () => <div data-testid="error-icon" />,
}));

describe("UploadNotifier", () => {
  const mockSetUploadStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const setupStore = (status: UploadStatus) => {
    mockUseStore.mockReturnValue({
      uploadStatus: status,
      setUploadStatus: mockSetUploadStatus,
    });
  };

  test('should render nothing when uploadStatus is "idle"', () => {
    setupStore("idle");
    render(<UploadNotifier />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  test("should display classifying message and loader", () => {
    setupStore("classifying");
    render(<UploadNotifier />);
    expect(screen.getByText("در حال ایجاد پست")).toBeInTheDocument();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });

  test("should display uploading message and loader", () => {
    setupStore("uploading");
    render(<UploadNotifier />);
    expect(screen.getByText("در حال ایجاد پست")).toBeInTheDocument();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });

  test("should display success message and icon", () => {
    setupStore("success");
    render(<UploadNotifier />);
    expect(screen.getByText("پست ایجاد شد")).toBeInTheDocument();
    expect(screen.getByTestId("success-icon")).toBeInTheDocument();
  });

  test("should display error message and icon", () => {
    setupStore("error");
    render(<UploadNotifier />);
    expect(screen.getByText("پست ایجاد نشد")).toBeInTheDocument();
    expect(screen.getByTestId("error-icon")).toBeInTheDocument();
  });

  test('should call setUploadStatus to "idle" after a delay on success', () => {
    setupStore("success");
    render(<UploadNotifier />);

    expect(screen.getByText("پست ایجاد شد")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockSetUploadStatus).toHaveBeenCalledWith("idle");
  });

  test('should call setUploadStatus to "idle" after a delay on error', () => {
    setupStore("error");
    render(<UploadNotifier />);

    expect(screen.getByText("پست ایجاد نشد")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockSetUploadStatus).toHaveBeenCalledWith("idle");
  });
});
