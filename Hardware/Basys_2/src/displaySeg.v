`timescale 1ns / 1ps
//////////////////////////////////////////////////////////////////////////////////
// Company: 
// Engineer: 
// 
// Create Date:    08:58:52 04/08/2026 
// Design Name: 
// Module Name:    displaySeg 
// Project Name: 
// Target Devices: 
// Tool versions: 
// Description: 
//
// Dependencies: 
//
// Revision: 
// Revision 0.01 - File Created
// Additional Comments: 
//
//////////////////////////////////////////////////////////////////////////////////
module displaySeg(
      input [15:0] counters,  // Contadores (4 dígitos, 4 bits cada)
		output reg [6:0] segments,  // Saída para os segmentos do display
		output reg [3:0] anodes,    // Saída para os ânodos dos displays
		input clock 
	 );


	reg [1:0] digit_select;
   reg [3:0] digit_value;
   reg [16:0] clock_divider; // Aumentado para estabilidade
   reg slow_clock;
	
	initial begin
		digit_select <= 2'b00;
      digit_value <= 4'b0000;
      anodes <= 4'b1111;
      segments <= 7'b1111111;
      clock_divider <= 0;
      slow_clock <= 0;
	end
	
	always @(posedge clock) begin
		clock_divider <= clock_divider + 1;
		slow_clock <= clock_divider[16]; // ajusta conforme necessário
	end

    always @(posedge slow_clock) begin
		// Multiplexação dos dígitos e controle dos ânodos
        case (digit_select)
				2'b00: begin digit_value <= counters[3:0];   anodes <= 4'b1110; end
            2'b01: begin digit_value <= counters[7:4];   anodes <= 4'b1101; end
            2'b10: begin digit_value <= counters[11:8];  anodes <= 4'b1011; end
            2'b11: begin digit_value <= counters[15:12]; anodes <= 4'b0111; end
        endcase
        digit_select <= digit_select + 1;	
		  // Decodificação do valor para os segmentos
        case (digit_value)
            4'h0: segments <= 7'b1000000; // 0
            4'h1: segments <= 7'b1111001; // 1
            4'h2: segments <= 7'b0100100; // 2
            4'h3: segments <= 7'b0110000; // 3
            4'h4: segments <= 7'b0011001; // 4
            4'h5: segments <= 7'b0010010; // 5
				4'h6: segments <= 7'b0000010; // 6
            4'h7: segments <= 7'b1111000; // 7
            4'h8: segments <= 7'b0000000; // 8
            4'h9: segments <= 7'b0010000; // 9
            default: segments <= 7'b1111111; // Apaga tudo temporariamente
        endcase
    end
endmodule
