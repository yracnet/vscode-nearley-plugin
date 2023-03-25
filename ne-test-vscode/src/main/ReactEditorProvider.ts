import * as vscode from "vscode";
import { assertNeTestClient } from "./util";

export type VSCReducer<T, A = any> = (
  file: string,
  state: T,
  action: A,
  postMessage: (action: any) => void
) => T;

export type VSCEditorConfig = {
  urlRoot: vscode.Uri;
  urlContent: string;
};

export class ReactEditorProvider implements vscode.CustomTextEditorProvider {
  constructor(
    private readonly config: VSCEditorConfig,
    private readonly reducer: VSCReducer<string>
  ) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    panel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    assertNeTestClient();

    const webview = panel.webview;
    const { urlContent, urlRoot } = this.config;
    webview.options = {
      enableScripts: true,
      localResourceRoots: [urlRoot],
    };
    const WEBVIEW_URI = panel.webview.asWebviewUri(urlRoot).toString();
    webview.html = urlContent.replace(/\/WEBVIEW_URI/g, WEBVIEW_URI);

    const postMessage = (action: any) => {
      // console.log(">>>VSCODE: postMessage", action.type);
      webview.postMessage(action);
    };
    let currentFile: string = document.fileName;
    let currentContent: string = document.getText();

    const onDidReceiveMessage = webview.onDidReceiveMessage(
      async (action: any) => {
        // console.log(">>>VSCODE: receiveMessage", action.type);
        currentContent = await this.reducer(
          currentFile,
          currentContent,
          action,
          postMessage
        );
      }
    );
    const onWillSaveTextDocument = vscode.workspace.onWillSaveTextDocument(
      (event) => {
        if (event.document === document) {
          const range = new vscode.Range(0, 0, document.lineCount, 0);
          event.waitUntil(
            Promise.resolve([new vscode.TextEdit(range, currentContent)])
          );
          postMessage({ type: "document:save", payload: currentContent });
        }
      }
    );
    const onChangeDocument = vscode.workspace.onDidChangeTextDocument(
      (event) => {
        if (event.document === document) {
          let currentNewContent = event.document.getText();
          if (currentNewContent !== currentContent) {
            currentContent = currentNewContent;
            postMessage({ type: "document:change", payload: currentContent });
          }
        }
      }
    );
    panel.onDidDispose(() => {
      onDidReceiveMessage.dispose();
      onChangeDocument.dispose();
      onWillSaveTextDocument.dispose();
    });
  }
}
