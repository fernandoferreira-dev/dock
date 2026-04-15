module top(
    input clk,              
    input uart_rx,          
    input btn_reset,        
    output [7:0] LED_STATES, 
    output uart_tx_out      
);

    wire [3:0] w_T, w_B, w_TR, w_INIT; 
    wire w_rx_valid;
    wire [11:0] w_all_states;
    
    reg [3:0] reg_T, reg_B, reg_TR, reg_INIT;
    
    reg [11:0] last_states;
    wire tx_busy;
    wire [7:0] packed_status;
	 
    uart_decoder decoder (
        .clk(clk),
        .rx(uart_rx),
        .reset(btn_reset),
        .T(w_T),
        .B(w_B),
        .TR(w_TR),
        .INIT_STATE(w_INIT),
        .rx_valid_out(w_rx_valid)
    );
	 
	
    always @(posedge clk) begin
        if (btn_reset) begin
            reg_T    <= 4'b0000;
            reg_B    <= 4'b0000;
            reg_TR   <= 4'b0000;
            reg_INIT <= 4'b0000; 
        end else if (w_rx_valid) begin
            reg_T    <= w_T;
            reg_B    <= w_B;
            reg_TR   <= w_TR;
            reg_INIT <= w_INIT; 
        end
    end
	  
	 wire [3:0] w_auto_T;

    random_spawner spawner (
        .clk(clk),
        .reset(btn_reset),
        .current_states(w_all_states),
        .auto_T(w_auto_T)
    );
	 
    system_4slots lockers (
        .clk(clk),
        .reset(btn_reset),
        .T(reg_T | w_auto_T), 
        .B(reg_B),
        .TR(reg_TR),
        .FORCE_OCUPADO(reg_INIT),
        .states(w_all_states) 
    );
	     
    assign packed_status = { w_all_states[10:9], w_all_states[7:6], w_all_states[4:3], w_all_states[1:0] };

    wire send_trigger = (w_all_states != last_states) && !tx_busy;
	 
	 always @(posedge clk) begin
        if (btn_reset) begin
            last_states <= 12'b0;
        end else if (send_trigger) begin
            last_states <= w_all_states;
        end
    end
	 
    uart_tx transmitter (
        .clk(clk),
        .data(packed_status), 
        .start(send_trigger),
        .tx(uart_tx_out),
        .busy(tx_busy)
    );

    assign LED_STATES = packed_status;

endmodule